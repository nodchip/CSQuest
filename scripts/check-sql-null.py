import sqlite3
con = sqlite3.connect(':memory:')
con.execute('CREATE TABLE entries (id TEXT, quantity INTEGER)')
con.executemany('INSERT INTO entries VALUES (?,?)', [('A',5),('B',7),('C',None)])
expected = {
    'quantity = 5': (['true','false','unknown'], ['A']),
    'quantity IS NULL': (['false','false','true'], ['C']),
    'NOT (quantity = 5)': (['false','true','unknown'], ['B']),
    '(quantity = 5) OR (quantity IS NULL)': (['true','false','true'], ['A','C']),
}
for expression, (truth, selected) in expected.items():
    actual = [row[0] for row in con.execute(f"SELECT CASE WHEN {expression} THEN 'true' WHEN NOT ({expression}) THEN 'false' ELSE 'unknown' END FROM entries ORDER BY id")]
    kept = [row[0] for row in con.execute(f'SELECT id FROM entries WHERE {expression} ORDER BY id')]
    assert actual == truth, (expression, actual)
    assert kept == selected, (expression, kept)
print('SQLite fixed NULL expressions: 4 cases passed')
