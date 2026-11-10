import sqlite3
c=sqlite3.connect(':memory:')
c.execute('CREATE TABLE entries (id TEXT, area TEXT, quantity INTEGER)')
c.executemany('INSERT INTO entries VALUES (?,?,?)',[('a1','A',2),('a2','A',2),('a3','A',None),('b1','B',3),('b2','B',3),('c1','C',None)])
assert c.execute('SELECT area,COUNT(*),COUNT(quantity),SUM(quantity) FROM entries GROUP BY area ORDER BY area').fetchall()==[('A',3,2,4),('B',2,2,6),('C',1,0,None)]
assert c.execute('SELECT id FROM entries WHERE quantity>=3 ORDER BY id').fetchall()==[('b1',),('b2',)]
assert c.execute('SELECT area,SUM(quantity) FROM entries WHERE quantity>=3 GROUP BY area ORDER BY area').fetchall()==[('B',6)]
assert c.execute('SELECT area,SUM(quantity) FROM entries GROUP BY area HAVING SUM(quantity)>=3 ORDER BY area').fetchall()==[('A',4),('B',6)]
print('SQLite grouped fixed cases passed')
