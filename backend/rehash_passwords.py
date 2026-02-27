"""
Rehash all existing passwords to bcrypt rounds=4 for fast login.
Run once: python rehash_passwords.py
"""
import psycopg2
from passlib.context import CryptContext

DB = dict(host="localhost", port=5432, dbname="vitasage_271527", user="postgres", password="271527")

old_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
new_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=4)

KNOWN_PASSES = {
    "akash": "akash",
    "doctor1": "doctor1",
    "staff1": "staff1",
    "admin": "admin123",
    "administrator": "admin123",
}

print("Rehashing doctor/staff passwords to bcrypt rounds=4...")
conn = psycopg2.connect(**DB)
cur = conn.cursor()

cur.execute("SELECT id, username, password_hash FROM users")
rows = cur.fetchall()
updated = 0

for row in rows:
    uid, uname, phash = row
    plain = KNOWN_PASSES.get(uname)
    if not plain:
        for candidate in ["123456", "password", "admin", "doctor", "staff", uname]:
            try:
                if old_ctx.verify(candidate, phash):
                    plain = candidate
                    break
            except Exception:
                pass
    if plain:
        new_hash = new_ctx.hash(plain)
        cur.execute("UPDATE users SET password_hash=%s WHERE id=%s", (new_hash, uid))
        print("  OK " + uname + " -> rehashed")
        updated += 1
    else:
        print("  SKIP " + uname + " -> unknown password")

# Also rehash registered patients
print("\nRehashing patient passwords to bcrypt rounds=4...")
cur.execute("SELECT id, abha_id, password_hash FROM registered_patients")
patients = cur.fetchall()
for pid, abha, phash in patients:
    for candidate in ["123456", "password", abha, "patient"]:
        try:
            if old_ctx.verify(candidate, phash):
                new_hash = new_ctx.hash(candidate)
                cur.execute("UPDATE registered_patients SET password_hash=%s WHERE id=%s", (new_hash, pid))
                print("  OK Patient " + str(abha) + " -> rehashed")
                updated += 1
                break
        except Exception:
            pass

conn.commit()
cur.close()
conn.close()
print("\nDone. " + str(updated) + " passwords rehashed.")
