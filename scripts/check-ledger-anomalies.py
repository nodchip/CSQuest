"""Independently check the six ledger cases with SQLite."""
import sqlite3

def setup():
    db = sqlite3.connect(':memory:')
    db.execute('PRAGMA foreign_keys=ON')
    db.executescript("""
      CREATE TABLE flat(course TEXT, name TEXT, student TEXT NOT NULL, PRIMARY KEY(course,student));
      INSERT INTO flat VALUES ('S','星','アオ'),('S','星','リナ'),('T','太陽','カイ');
      CREATE TABLE courses(id TEXT PRIMARY KEY, name TEXT NOT NULL);
      CREATE TABLE enroll(course TEXT REFERENCES courses(id), student TEXT NOT NULL, PRIMARY KEY(course,student));
      INSERT INTO courses VALUES ('S','星'),('T','太陽');
      INSERT INTO enroll VALUES ('S','アオ'),('S','リナ'),('T','カイ');
    """)
    return db

db=setup()
db.execute("UPDATE flat SET name='星読み' WHERE student='アオ'")
assert set(db.execute("SELECT name FROM flat WHERE course='S'")) == {('星',),('星読み',)}
db.execute("UPDATE courses SET name='星読み' WHERE id='S'")
assert set(db.execute("SELECT name FROM courses JOIN enroll ON id=course WHERE id='S'")) == {('星読み',)}
db=setup()
try:
    db.execute("INSERT INTO flat(course,name,student) VALUES ('M','月',NULL)")
    raise AssertionError('NULL must be rejected')
except sqlite3.IntegrityError:
    pass
db.execute("INSERT INTO courses VALUES ('M','月')")
assert db.execute("SELECT name FROM courses WHERE id='M'").fetchone() == ('月',)
assert db.execute("SELECT count(*) FROM courses JOIN enroll ON id=course WHERE id='M'").fetchone() == (0,)
db=setup()
db.execute("DELETE FROM flat WHERE student='カイ'")
assert db.execute("SELECT count(*) FROM flat WHERE course='T'").fetchone() == (0,)
db.execute("DELETE FROM enroll WHERE student='カイ'")
assert db.execute("SELECT name FROM courses WHERE id='T'").fetchone() == ('太陽',)
try:
    db.execute("INSERT INTO enroll VALUES ('X','ミナ')")
    raise AssertionError('missing course must be rejected')
except sqlite3.IntegrityError:
    pass
print('SQLite: six outcomes, join and foreign-key constraint verified')
