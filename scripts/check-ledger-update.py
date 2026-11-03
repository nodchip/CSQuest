import json
import sqlite3

filters = {'lt2': 'amount < 2', 'eqnull': 'amount = NULL', 'isnull': 'amount IS NULL', 'all': '1', 'ge3': 'amount >= 3'}
operations = {'plus1': 'amount + 1', 'zero': '0', 'minus2': 'amount - 2'}
db = sqlite3.connect(':memory:', isolation_level=None)
db.execute('CREATE TABLE stock (id INTEGER PRIMARY KEY, amount INTEGER CHECK(amount >= 0))')
results = []
for filter_name, condition in filters.items():
    for operation_name, expression in operations.items():
        db.execute('DELETE FROM stock')
        db.executemany('INSERT INTO stock(id, amount) VALUES (?, ?)', enumerate([3, 1, 0, None]))
        try:
            cursor = db.execute(f'UPDATE stock SET amount = {expression} WHERE {condition}')
            ok, matched = True, cursor.rowcount
        except sqlite3.IntegrityError:
            ok, matched = False, None
        values = [row[0] for row in db.execute('SELECT amount FROM stock ORDER BY id')]
        results.append({'filter': filter_name, 'operation': operation_name, 'ok': ok, 'matched': matched, 'values': values})
db.execute('DELETE FROM stock')
db.executemany('INSERT INTO stock(id, amount) VALUES (?, ?)', enumerate([3, 1, 0, None]))
db.execute('BEGIN')
db.execute('UPDATE stock SET amount = amount + 1')
db.execute('ROLLBACK')
assert [row[0] for row in db.execute('SELECT amount FROM stock ORDER BY id')] == [3, 1, 0, None]
print(json.dumps({'sqlite_version': sqlite3.sqlite_version, 'results': results}))
