import sqlite3

def test_left_join_conditions():
    db = sqlite3.connect(':memory:')
    db.executescript("create table herb(id text); create table tags(id text,color text); insert into herb values ('A'),('B'),('C'); insert into tags values ('A','red'),('A','blue'),('B','blue');")
    all_rows = db.execute('select h.id,t.color from herb h left join tags t on h.id=t.id').fetchall()
    on_rows = db.execute("select h.id,t.color from herb h left join tags t on h.id=t.id and t.color='red'").fetchall()
    where_rows = db.execute("select h.id,t.color from herb h left join tags t on h.id=t.id where t.color='red'").fetchall()
    assert sorted(all_rows, key=str) == sorted([('A','red'),('A','blue'),('B','blue'),('C',None)], key=str)
    assert sorted(on_rows, key=str) == sorted([('A','red'),('B',None),('C',None)], key=str)
    assert where_rows == [('A','red')]

if __name__ == '__main__':
    test_left_join_conditions()
