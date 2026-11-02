"""Rebuild the small teaching subset from UCI's original train/test files."""
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen

base = 'https://archive.ics.uci.edu/ml/machine-learning-databases/optdigits/'
classes = [0, 1, 8]
subset = {}
for split, filename, limit in [('train', 'optdigits.tra', 20), ('test', 'optdigits.tes', 10)]:
    with urlopen(base + filename, timeout=30) as response:
        raw = response.read()
    print(filename, 'sha256', hashlib.sha256(raw).hexdigest())
    rows = [list(map(int, row.split(','))) for row in raw.decode('ascii').splitlines() if row.strip()]
    subset[split] = []
    for label in classes:
        matching = [row for row in rows if len(row) == 65 and row[-1] == label]
        if len(matching) < limit:
            raise ValueError('Not enough labeled samples')
        subset[split].extend({'label': label, 'pixels': row[:-1]} for row in matching[:limit])
target = Path(__file__).resolve().parents[1] / 'src' / 'uci-digits-data.js'
target.write_text('// Rebuild with scripts/import-uci-digits.py; see docs/uci-digits.md.\nexport const digitData=' + json.dumps(subset, separators=(',', ':')) + ';\n', encoding='utf-8')
print('Wrote', target, 'train', len(subset['train']), 'test', len(subset['test']))
