import json
import sqlite3
import sys

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')
data = json.load(sys.stdin)
db = sqlite3.connect(':memory:')
db.execute('CREATE TABLE deliveries (day TEXT, person TEXT, village TEXT, amount INTEGER)')
for day, entry in data['days'].items():
    db.executemany('INSERT INTO deliveries VALUES (?, ?, ?, ?)',
                   [(day, r['person'], r['village'], r['count']) for r in entry['rows']])
results = []
for case in data['conditions']:
    # Column names come from this fixed allowlist; query values are parameters.
    column = {'person': 'person', 'village': 'village'}[case['output']]
    values = [row[0] for row in db.execute(
        f'SELECT DISTINCT {column} FROM deliveries WHERE day = ? AND (? = ? OR village = ?) AND amount >= ?',
        (case['day'], case['village'], 'all', case['village'], int(case['minimum'])))]
    results.append({**case, 'values': values})
print(json.dumps({'sqlite_version': sqlite3.sqlite_version, 'results': results}, ensure_ascii=False))
