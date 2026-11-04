"""Export an unverified inventory of curriculum ledger rows, not a completion percentage."""
from collections import Counter
import argparse
import csv
import re
import sys
from pathlib import Path

STATES = {'未照合', '部分', '完了'}
COLUMNS = ('候補ID', '分野', '知識単位', '種別', '区分', '原典番号', '要約', '台帳状態', '根拠と残る範囲', '台帳', '行', '要確認')


def unit_list(path):
    units = []
    for line in path.read_text(encoding='utf-8').splitlines():
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) >= 5 and re.fullmatch(r'[A-Z]+-[A-Za-z/\-]+', cells[1]):
            units.append((cells[0], cells[1]))
    if len(units) != 166 or len(set(u for _, u in units)) != len(units) or len(set(f for f, _ in units)) != 17:
        raise ValueError('知識単位目録が166単位・17分野・一意でありません')
    return units


def parse_inventory(root):
    root = Path(root)
    units = unit_list(root / 'docs' / 'knowledge-units.md')
    fields = {u: f for f, u in units}
    records = []
    mapped = Counter()
    paths = sorted((root / 'docs').glob('coverage-*.md'))
    for path in paths:
        if path.name == 'coverage-status.md':
            continue
        before = len(records)
        lines = path.read_text(encoding='utf-8').splitlines()
        if not lines:
            raise ValueError(f'{path}: 空ファイル')
        title = lines[0]
        matching = [u for _, u in units if re.search(r'(?<![A-Za-z/\-])' + re.escape(u) + r'(?![A-Za-z/\-])', title, re.I)]
        combined = path.name == 'coverage-sdf-core.md'
        if not combined and len(matching) != 1:
            raise ValueError(f'{path}: 知識単位を特定できません: {matching}')
        unit = None if combined else matching[0]
        if unit:
            mapped[unit] += 1
        kind = None
        header = None
        status_index = None
        for line_no, line in enumerate(lines, 1):
            if line.startswith('## '):
                section = line[3:].strip()
                if combined and section in fields:
                    unit = section
                    mapped[unit] += 1
                    kind = None
                elif section == 'トピック':
                    kind = 'トピック'
                elif section == '例示学習成果':
                    kind = '学習成果'
            if not line.startswith('|'):
                header = None
                continue
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            if '状態' in cells:
                if cells.count('状態') != 1 or unit is None:
                    raise ValueError(f'{path}:{line_no}: 表見出しが不正')
                header = cells
                status_index = cells.index('状態')
                continue
            if header is None or all(cell and set(cell) <= set('-: ') for cell in cells):
                continue
            if len(cells) != len(header) or cells[status_index] not in STATES:
                raise ValueError(f'{path}:{line_no}: 台帳行が不正')
            label = cells[0]
            category = kind
            if combined:
                if label.startswith('トピック'):
                    category, label = 'トピック', label[len('トピック'):]
                elif label.startswith('成果'):
                    category, label = '学習成果', label[len('成果'):]
                else:
                    raise ValueError(f'{path}:{line_no}: 種別が不明')
            elif category is None:
                category = '学習成果' if header[0] == '成果' else 'トピック'
            core = cells[header.index('区分')] if '区分' in header else '未記載'
            summary_index = next((i for i, h in enumerate(header) if h in ('要約', '内容', '内容の要約')), None)
            if summary_index is None:
                raise ValueError(f'{path}:{line_no}: 要約列が不明')
            flags = ['原典との照合未確認']
            if not re.fullmatch(r'\d+[a-z]?(?:\.[a-z0-9]+)?', label):
                flags.append('番号を要確認')
            if core == '未記載':
                flags.append('区分を要確認')
            key = f'{unit}:{category}:{core}:{label}'
            records.append({'候補ID':key,'分野':fields[unit],'知識単位':unit,'種別':category,'区分':core,'原典番号':label,'要約':cells[summary_index],'台帳状態':cells[status_index],'根拠と残る範囲':cells[-1],'台帳':path.name,'行':str(line_no),'要確認':flags})
        if len(records) == before:
            raise ValueError(f'{path}: 状態付きの台帳行がありません')
    missing = set(fields) - set(mapped)
    repeated = [u for u, n in mapped.items() if n != 1]
    if missing or repeated:
        raise ValueError(f'台帳の対応不足・重複: {sorted(missing)}, {repeated}')
    counts = Counter(r['候補ID'] for r in records)
    for r in records:
        if counts[r['候補ID']] > 1:
            r['要確認'].append('候補ID重複')
    for r in records:
        # Never discard a parent automatically: its own text may contain scope not in its children.
        number = r['原典番号']
        for other in records:
            if (r is not other and r['知識単位'] == other['知識単位'] and r['種別'] == other['種別'] and r['区分'] == other['区分'] and re.fullmatch(r'\d+[a-z]?(?:\.[a-z0-9]+)?', number) and re.fullmatch(re.escape(number) + r'(?:[a-z]|\.[a-z0-9]+)', other['原典番号'])):
                r['要確認'].append('親子重複候補')
                break
        r['要確認'] = '・'.join(r['要確認'])
    return records


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--csv', type=Path, help='候補行を UTF-8 CSV に保存')
    parser.add_argument('--check', type=Path, help='保存済み CSV が台帳と一致するか検査')
    args = parser.parse_args()
    records = parse_inventory(Path(__file__).resolve().parents[1])
    if args.csv:
        with args.csv.open('w', encoding='utf-8-sig', newline='') as out:
            writer = csv.DictWriter(out, fieldnames=COLUMNS)
            writer.writeheader()
            writer.writerows(records)
    if args.check:
        with args.check.open(encoding='utf-8-sig', newline='') as source:
            reader = csv.DictReader(source)
            if reader.fieldnames != list(COLUMNS) or list(reader) != records:
                raise ValueError(f'{args.check}: 目録が台帳と一致しません。--csv で再生成してください')
    kinds = Counter(r['種別'] for r in records)
    print(f'台帳の候補行: {len(records)}（トピック {kinds["トピック"]}、学習成果 {kinds["学習成果"]}）')
    print(f'候補ID重複: {sum("候補ID重複" in r["要確認"] for r in records)} 行、親子重複候補: {sum("親子重複候補" in r["要確認"] for r in records)} 行')
    print('原典との照合・親子の扱い・完成根拠の監査が必要。候補行数は完成率の分母ではありません。')


if __name__ == '__main__':
    try:
        main()
    except ValueError as exc:
        print(f'エラー: {exc}', file=sys.stderr)
        raise SystemExit(1)
