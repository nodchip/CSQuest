"""Compare selected workshop examples with a temporary SQLite database.

Reopening after commit checks persistence across connections, not power-loss
durability; the UI uses a separately stated crash/recovery model.
"""
import sqlite3
from pathlib import Path
from tempfile import TemporaryDirectory


def main():
    with TemporaryDirectory(prefix="csquest-acid-") as folder:
        path = Path(folder) / "example.db"
        db = sqlite3.connect(path, timeout=0, isolation_level=None)
        other = sqlite3.connect(path, timeout=0, isolation_level=None)
        try:
            db.execute("PRAGMA journal_mode=WAL")
            db.execute("CREATE TABLE stock (name TEXT PRIMARY KEY, amount INTEGER NOT NULL CHECK(amount >= 0))")
            db.executemany("INSERT INTO stock VALUES (?, ?)", [("north", 5), ("south", 1)])

            db.execute("BEGIN")
            db.execute("UPDATE stock SET amount = amount - 3 WHERE name = 'north'")
            db.execute("ROLLBACK")
            assert db.execute("SELECT amount FROM stock ORDER BY name").fetchall() == [(5,), (1,)]

            db.execute("UPDATE stock SET amount = CASE name WHEN 'north' THEN 1 ELSE 5 END")
            db.execute("BEGIN")
            try:
                db.execute("UPDATE stock SET amount = amount - 2 WHERE name = 'north'")
                raise AssertionError("the nonnegative constraint did not reject the update")
            except sqlite3.IntegrityError:
                db.execute("ROLLBACK")
            assert db.execute("SELECT amount FROM stock ORDER BY name").fetchall() == [(1,), (5,)]

            db.execute("UPDATE stock SET amount = 2 WHERE name = 'north'")
            db.execute("BEGIN")
            other.execute("BEGIN")
            assert db.execute("SELECT amount FROM stock WHERE name='north'").fetchone()[0] == 2
            assert other.execute("SELECT amount FROM stock WHERE name='north'").fetchone()[0] == 2
            db.execute("UPDATE stock SET amount=1 WHERE name='north'")
            db.execute("COMMIT")
            try:
                other.execute("UPDATE stock SET amount=1 WHERE name='north'")
                raise AssertionError("the stale concurrent write was not rejected")
            except sqlite3.OperationalError as error:
                assert "locked" in str(error).lower()
                other.execute("ROLLBACK")
            other.execute("BEGIN")
            other.execute("UPDATE stock SET amount=amount-1 WHERE name='north'")
            other.execute("COMMIT")
            assert db.execute("SELECT amount FROM stock WHERE name='north'").fetchone()[0] == 0

            db.execute("UPDATE stock SET amount=7 WHERE name='north'")
        finally:
            other.close()
            db.close()
        reopened = sqlite3.connect(path)
        try:
            assert reopened.execute("SELECT amount FROM stock WHERE name='north'").fetchone()[0] == 7
        finally:
            reopened.close()
    print("SQLite: rollback, constraint, stale-write retry, and reopen passed; crash durability not tested.")


if __name__ == "__main__":
    main()
