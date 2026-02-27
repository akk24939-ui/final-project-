"""
VitaSage AI -- FRESH USER SETUP
Deletes ALL existing users and creates:
  HSP ID 1   -> akash    | admin  | 271527
  HSP ID 101 -> rishie   | doctor | 271527
  HSP ID 101 -> vairavan | staff  | 271527

Run: python fresh_users.py
"""
import sys
try:
    import psycopg2
    from passlib.context import CryptContext
except ImportError:
    print("[ERROR] Run: pip install psycopg2-binary passlib[bcrypt]")
    sys.exit(1)

DB_HOST     = "localhost"
DB_PORT     = 5432
DB_NAME     = "vitasage_271527"
DB_USER     = "postgres"
DB_PASSWORD = "271527"

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=4)

print("\nVitaSage AI -- Fresh User Setup")
print("=" * 55)

conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
conn.autocommit = False
cur  = conn.cursor()
print("[OK] Connected to database: vitasage_271527")

# ── Step 1: Nullify foreign key references before deleting users ──
# advanced_prescriptions references doctor_id (users.id)
cur.execute("UPDATE advanced_prescriptions SET doctor_id = NULL WHERE doctor_id IS NOT NULL")
print(f"[OK] Cleared doctor_id in advanced_prescriptions ({cur.rowcount} rows)")

# medical_records references uploaded_by (users.id)
cur.execute("UPDATE medical_records SET uploaded_by = NULL WHERE uploaded_by IS NOT NULL")
print(f"[OK] Cleared uploaded_by in medical_records ({cur.rowcount} rows)")

# patient_diagnosis_reports references doctor_id
cur.execute("UPDATE patient_diagnosis_reports SET doctor_id = NULL WHERE doctor_id IS NOT NULL")
print(f"[OK] Cleared doctor_id in patient_diagnosis_reports ({cur.rowcount} rows)")

# lab_reports references staff_id
cur.execute("UPDATE lab_reports SET staff_id = NULL WHERE staff_id IS NOT NULL")
print(f"[OK] Cleared staff_id in lab_reports ({cur.rowcount} rows)")

# ── Step 1b: Delete ALL existing users ─────────────────────
cur.execute("DELETE FROM users")
deleted = cur.rowcount
print(f"[OK] Deleted {deleted} existing user(s)")

# ── Step 2: Ensure Hospital ID 1 exists ────────────────────
cur.execute("SELECT id FROM hospitals WHERE hospital_id = %s", ("1",))
h1 = cur.fetchone()
if not h1:
    cur.execute(
        "INSERT INTO hospitals (hospital_id, name, email, address) VALUES (%s,%s,%s,%s) RETURNING id",
        ("1", "VitaSage Central Hospital", "admin@vitasage.com", "1 Health Street, Chennai")
    )
    h1_id = cur.fetchone()[0]
    print("[OK] Hospital ID 1 created")
else:
    h1_id = h1[0]
    print(f"[OK] Hospital ID 1 found (row id={h1_id})")

# ── Step 3: Ensure Hospital ID 101 exists ──────────────────
cur.execute("SELECT id FROM hospitals WHERE hospital_id = %s", ("101",))
h101 = cur.fetchone()
if not h101:
    cur.execute(
        "INSERT INTO hospitals (hospital_id, name, email, address) VALUES (%s,%s,%s,%s) RETURNING id",
        ("101", "VitaSage Hospital 101", "admin101@vitasage.com", "101 Health Avenue, Chennai")
    )
    h101_id = cur.fetchone()[0]
    print("[OK] Hospital ID 101 created")
else:
    h101_id = h101[0]
    print(f"[OK] Hospital ID 101 found (row id={h101_id})")

# ── Step 4: Create fresh users ─────────────────────────────
# (hospital_row_id, username, email, password_plain, role, full_name)
USERS = [
    (h1_id,   "akash",    "akash@vitasage.com",    "271527", "admin",  "Akash"),
    (h101_id, "rishie",   "rishie@vitasage.com",   "271527", "doctor", "Dr. Rishie"),
    (h101_id, "vairavan", "vairavan@vitasage.com", "271527", "staff",  "Vairavan"),
]

for (hid, username, email, password, role, full_name) in USERS:
    pw_hash = pwd_ctx.hash(password)
    cur.execute(
        """
        INSERT INTO users (hospital_id, username, email, password_hash, role, full_name, status)
        VALUES (%s, %s, %s, %s, %s, %s, true)
        """,
        (hid, username, email, pw_hash, role, full_name)
    )
    print(f"[OK] Created: {username:10s} | role={role:6s} | hospital_id={hid}")

conn.commit()
cur.close()
conn.close()

print("\n[DONE] All fresh users created!")
print("=" * 55)
print("  Admin  -> Hospital: 1   | User: akash    | Pass: 271527")
print("  Doctor -> Hospital: 101 | User: rishie   | Pass: 271527")
print("  Staff  -> Hospital: 101 | User: vairavan | Pass: 271527")
print("=" * 55)
