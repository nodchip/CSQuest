"""Join candidate rows with current-adventure assessments without counting coverage."""
import argparse
import csv
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

INVENTORY_COLUMNS = ('候補ID', '分野', '知識単位', '種別', '区分', '原典番号', '要約', '台帳', '行', '要確認')
ASSESSMENT_COLUMNS = ('冒険の依頼ID', '教材の状態', '学習成果と残る範囲', '到達と動作の根拠', '正確さと自動検証', '独立レビュー')
OUTPUT_COLUMNS = INVENTORY_COLUMNS + ('原典照合記録', '原典照合状態', '便宜的分割の注意', '現行冒険の評価') + ASSESSMENT_COLUMNS


def auxiliary(row):
    unit, kind, number = row['知識単位'], row['種別'], row['原典番号']
    if kind != 'トピック':
        return ''
    if unit == 'GIT-Shading' and number in ('2a', '2b', '2c'):
        return '原典2の便宜的分割。監査文書参照'
    if unit == 'GIT-Simulation' and number == '1-応答':
        return '原典1の補助行。監査文書参照'
    if unit == 'SEC-Crypto' and re.fullmatch(r'(12[a-g]|13[a-d]|14[a-b]|15[a-b])', number):
        return '原典の番号付き子でない例の分割。監査文書参照'
    return '他の便宜的分割の有無は監査文書を確認'


def join_rows(inventory, assessments, audits):
    counts = Counter(row['候補ID'] for row in inventory)
    if '' in counts or any(n != 1 for n in counts.values()):
        raise ValueError('候補IDが空または重複しています')
    by_id = defaultdict(list)
    for row in assessments:
        key = row['候補ID']
        if key not in counts:
            raise ValueError(f'現行冒険の評価が存在しない候補IDを参照: {key}')
        if not row['教材の状態']:
            raise ValueError(f'評価の教材の状態が空です: {key}')
        by_id[key].append(row)
    result = []
    for row in inventory:
        audit = audits.get(row['知識単位'])
        for assessment in by_id.get(row['候補ID'], [None]):
            result.append({**{key: row[key] for key in INVENTORY_COLUMNS},
                '原典照合記録': audit['document'] if audit else '',
                '原典照合状態': '照合記録あり・内容は要確認' if audit else '未照合',
                '便宜的分割の注意': auxiliary(row),
                '現行冒険の評価': '評価記録あり' if assessment else '評価未作成',
                **{key: assessment[key] if assessment else '' for key in ASSESSMENT_COLUMNS}})
    return result


def read_csv(path):
    with path.open(encoding='utf-8-sig', newline='') as stream:
        return list(csv.DictReader(stream))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    docs = args.root / 'docs'
    inventory = read_csv(docs / 'curriculum-inventory-draft.csv')
    assessments = read_csv(docs / 'adventure-curriculum-assessment.csv')
    audits = json.loads((docs / 'curriculum-audits.json').read_text(encoding='utf-8'))['units']
    rows = join_rows(inventory, assessments, audits)
    with args.output.open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)
    print(f'{len(rows)} 行を出力しました。行数は完成率ではありません。')


if __name__ == '__main__':
    try:
        main()
    except (KeyError, ValueError, OSError) as error:
        print(error, file=sys.stderr)
        sys.exit(1)
