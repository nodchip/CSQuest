import json
import sqlite3

db = sqlite3.connect(':memory:')
db.executescript('''
CREATE TABLE trades(id TEXT, t INTEGER, quantity INTEGER);
CREATE TABLE prices(t INTEGER PRIMARY KEY, price INTEGER);
INSERT INTO trades VALUES ('A',1,2),('B',2,3),('C',4,4);
INSERT INTO prices VALUES (0,2),(3,3);
''')

def aggregate(kind):
    subquery = ('p.t = t.t' if kind == 'exact' else 'p.t <= t.t')
    sql = f'''WITH joined AS (
      SELECT t.t, t.quantity,
        (SELECT p.price FROM prices p WHERE {subquery} ORDER BY p.t DESC LIMIT 1) AS price
      FROM trades t
    ) SELECT t / 3, SUM(quantity), SUM(quantity * price)
      FROM joined WHERE price IS NOT NULL GROUP BY t / 3'''
    result = [{'qty': 0, 'revenue': 0}, {'qty': 0, 'revenue': 0}]
    for bucket, quantity, revenue in db.execute(sql):
        result[bucket] = {'qty': quantity, 'revenue': revenue}
    return result

exact = aggregate('exact')
before = aggregate('asof')
db.execute('CREATE TABLE saved(bucket INTEGER, qty INTEGER, revenue INTEGER)')
db.executemany('INSERT INTO saved VALUES (?,?,?)', [(i, r['qty'], r['revenue']) for i, r in enumerate(before)])
db.execute("INSERT INTO trades VALUES ('D',2,1)")
after = aggregate('asof')
stale = [{'qty': q, 'revenue': v} for _, q, v in db.execute('SELECT * FROM saved ORDER BY bucket')]
db.execute('DELETE FROM saved')
db.executemany('INSERT INTO saved VALUES (?,?,?)', [(i, r['qty'], r['revenue']) for i, r in enumerate(after)])
fresh = [{'qty': q, 'revenue': v} for _, q, v in db.execute('SELECT * FROM saved ORDER BY bucket')]
print(json.dumps({'sqlite_version': sqlite3.sqlite_version, 'exact': exact, 'before': before, 'after': after, 'stale': stale, 'fresh': fresh}))
