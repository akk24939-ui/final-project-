from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserOut
from app.dependencies import require_admin, get_current_user

router = APIRouter(prefix="/users", tags=["Users"])
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/", response_model=List[UserOut])
async def list_users(
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.hospital_id == current_user.hospital_id)
    )
    return result.scalars().all()


# IMPORTANT: /me must come BEFORE /{user_id} to avoid FastAPI matching "me" as int
@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if payload.role not in ("admin", "doctor", "staff"):
        raise HTTPException(status_code=400, detail="Invalid role. Must be admin, doctor, or staff.")

    # Check for duplicate username first
    existing = await db.execute(select(User).where(User.username == payload.username))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail=f"Username '{payload.username}' is already taken.")

    # Generate email if not provided
    email = payload.email or f"{payload.username}@vitasage.local"

    # Check for duplicate email
    existing_email = await db.execute(select(User).where(User.email == email))
    if existing_email.scalar_one_or_none():
        email = f"{payload.username}_{current_user.hospital_id}@vitasage.local"

    user = User(
        hospital_id=current_user.hospital_id,
        username=payload.username,
        email=email,
        password_hash=pwd_ctx.hash(payload.password),
        role=payload.role,
        full_name=payload.full_name,
        status=True,
    )
    db.add(user)
    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError as e:
        await db.rollback()
        detail = str(e.orig)
        if "username" in detail:
            raise HTTPException(status_code=400, detail=f"Username '{payload.username}' already exists.")
        if "email" in detail:
            raise HTTPException(status_code=400, detail="Email already in use. Try a different one.")
        raise HTTPException(status_code=400, detail="Could not create user — duplicate data.")
    return user


@router.patch("/{user_id}/toggle", response_model=UserOut)
async def toggle_user_status(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.id == user_id, User.hospital_id == current_user.hospital_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = not user.status
    await db.commit()
    await db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a user from the hospital. Admin only."""
    result = await db.execute(
        select(User).where(User.id == user_id, User.hospital_id == current_user.hospital_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    await db.delete(user)
    await db.commit()
