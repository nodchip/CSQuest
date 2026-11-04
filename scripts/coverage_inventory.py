"""Export an unverified inventory of curriculum ledger rows, not a completion percentage."""
from collections import Counter
import argparse
import hashlib
import json
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
            flags = ['原典照合結果は監査記録参照']
            if not re.fullmatch(r'\d+[a-z]?(?:[.-][a-z0-9]+)*', label):
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
            if (r is not other and r['知識単位'] == other['知識単位'] and r['種別'] == other['種別'] and r['区分'] == other['区分'] and re.fullmatch(r'\d+[a-z]?(?:[.-][a-z0-9]+)*', number) and re.fullmatch(re.escape(number) + (r'(?:[a-z]|[.-][a-z0-9]+)' if number.isdecimal() else r'[.-][a-z0-9]+'), other['原典番号'])):
                r['要確認'].append('親子重複候補')
                break
        r['要確認'] = '・'.join(r['要確認'])
    return records


def scope_digest(rows):
    # Descriptions and identifiers are audited; evidence/status updates alone do not alter the denominator.
    items = sorted((row['候補ID'], row['要約']) for row in rows)
    payload = json.dumps(items, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    return hashlib.sha256(payload).hexdigest()


def validate_audits(root, records, audit_file):
    data = json.loads(Path(audit_file).read_text(encoding='utf-8'))
    if data.get('version') != 1 or not isinstance(data.get('units'), dict):
        raise ValueError('照合記録の形式が不正です')
    groups = {}
    for row in records:
        groups.setdefault(row['知識単位'], []).append(row)
    for unit, audit in data['units'].items():
        if unit not in groups or not isinstance(audit, dict):
            raise ValueError(f'{unit}: 知識単位が不正です')
        rows = groups[unit]
        ids = [r['候補ID'] for r in rows]
        if len(ids) != len(set(ids)):
            raise ValueError(f'{unit}: 候補 ID が重複しています')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', audit.get('date', '')):
            raise ValueError(f'{unit}: 照合日が不正です')
        if audit.get('source') != 'https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf':
            raise ValueError(f'{unit}: 原典が不正です')
        doc = audit.get('document', '')
        if not re.fullmatch(r'docs/curriculum-audit-[a-z0-9-]+\.md', doc) or not (Path(root) / doc).is_file():
            raise ValueError(f'{unit}: 照合記録がありません')
        if (audit.get('topics') != sum(r['種別'] == 'トピック' for r in rows)
                or audit.get('outcomes') != sum(r['種別'] == '学習成果' for r in rows)
                or audit.get('scope_sha256') != scope_digest(rows)):
            raise ValueError(f'{unit}: 台帳の範囲が照合時から変わりました。原典と照合し直してください')
    return len(data['units'])


def assessment_digest(row):
    payload = json.dumps([row['候補ID'], row['要約'], row['台帳状態'], row['根拠と残る範囲']], ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    return hashlib.sha256(payload).hexdigest()


def validate_assessments(root, records, assessment_file, audit_file):
    # A validated record means its stated review is traceable, not that the judgment is automatically true.
    data = json.loads(Path(assessment_file).read_text(encoding='utf-8'))
    scopes = json.loads(Path(audit_file).read_text(encoding='utf-8'))
    if data.get('version') != 1 or not isinstance(data.get('items'), dict):
        raise ValueError('項目別評価の形式が不正です')
    rows = {}
    for row in records:
        if row['候補ID'] in rows:
            rows[row['候補ID']] = None
        else:
            rows[row['候補ID']] = row
    for key, entry in data['items'].items():
        row = rows.get(key)
        if row is None or not isinstance(entry, dict) or row['知識単位'] not in scopes.get('units', {}):
            raise ValueError(f'{key}: 項目が一意でないか、分母未照合です')
        if entry.get('status') != row['台帳状態'] or entry.get('row_sha256') != assessment_digest(row):
            raise ValueError(f'{key}: 台帳の内容が評価時から変わりました')
        doc = entry.get('document', '')
        if not re.fullmatch(r'docs/curriculum-assessment-[a-z0-9-]+\.md', doc) or not (Path(root) / doc).is_file():
            raise ValueError(f'{key}: 評価記録がありません')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', entry.get('date', '')):
            raise ValueError(f'{key}: 評価日が不正です')
        files = entry.get('files')
        if not isinstance(files, dict) or not files:
            raise ValueError(f'{key}: 検査対象のファイルがありません')
        for name, digest in files.items():
            if not re.fullmatch(r'(?:src|tests)/[a-z0-9.-]+\.(?:js|mjs)', name):
                raise ValueError(f'{key}: 対象ファイル名が不正です')
            path = Path(root) / name
            if not path.is_file() or hashlib.sha256(path.read_bytes().replace(b'\r\n', b'\n')).hexdigest() != digest:
                raise ValueError(f'{key}: 対象ファイルが評価時から変わりました: {name}')
    return len(data['items'])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--csv', type=Path, help='候補行を UTF-8 CSV に保存')
    parser.add_argument('--check', type=Path, help='保存済み CSV が台帳と一致するか検査')
    parser.add_argument('--audit', type=Path, help='分母の照合記録と台帳の範囲を検査')
    parser.add_argument('--assessments', type=Path, help='項目別評価と検証対象を検査')
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
    if args.audit:
        n = validate_audits(Path(__file__).resolve().parents[1], records, args.audit)
        print(f'原典と分母候補を照合済み: {n} / 166 知識単位（教材の完成・正確性は別途監査）')
    if args.assessments:
        if not args.audit:
            raise ValueError('項目別評価の検査には --audit が必要です')
        count = validate_assessments(Path(__file__).resolve().parents[1], records, args.assessments, args.audit)
        print(f'項目別評価の記録と対象が一致: {count} 行（判定の正しさは別途確認）')
    kinds = Counter(r['種別'] for r in records)
    print(f'台帳の候補行: {len(records)}（トピック {kinds["トピック"]}、学習成果 {kinds["学習成果"]}）')
    print(f'候補ID重複: {sum("候補ID重複" in r["要確認"] for r in records)} 行、親子重複候補: {sum("親子重複候補" in r["要確認"] for r in records)} 行')
    print('未照合単位・親子の扱い・完成根拠の監査が必要。候補行数は完成率の分母ではありません。')


if __name__ == '__main__':
    try:
        main()
    except ValueError as exc:
        print(f'エラー: {exc}', file=sys.stderr)
        raise SystemExit(1)
