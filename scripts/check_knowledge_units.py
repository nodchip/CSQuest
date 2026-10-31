from __future__ import annotations

import argparse
import re
from collections import Counter
from pathlib import Path

AREAS = r'AI|AL|AR|DM|FPL|GIT|HCI|MSF|NC|OS|PDC|SDF|SE|SEC|SEP|SF|SPD'
TOC_ROW = re.compile(rf'^\s*((?:{AREAS})-[A-Za-z][A-Za-z/-]*)(?::\s*([^\n]*?))?\s*\.{{5,}}\s*(\d+)\s*$', re.M)
CATALOG_ROW = re.compile(r'^\|\s*\w+\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|', re.M)
TOC_CANDIDATE = re.compile(rf'^\s*(?:{AREAS})-[A-Za-z]')
END_OF_TOC = re.compile(r'^\s*Core Topics Table\s*\.{5,}\s*317\s*$', re.M)


def normalize_title(title: str) -> str:
    return re.sub(r'[^a-z0-9]', '', title.lower())


def duplicates(rows: list[tuple[str, str, str]]) -> list[str]:
    counts = Counter(row[0].casefold() for row in rows)
    return sorted(key for key, count in counts.items() if count > 1)


def main() -> int:
    parser = argparse.ArgumentParser(description='Compare CS2023 table-of-contents units with the project catalog.')
    parser.add_argument('source', type=Path, help='UTF-8 text extracted from CS2023.pdf')
    parser.add_argument('--catalog', type=Path, default=Path('docs/knowledge-units.md'))
    args = parser.parse_args()
    source = args.source.read_text(encoding='utf-8')
    end = END_OF_TOC.search(source)
    if not end:
        raise SystemExit('Could not locate the end of the table of contents.')
    toc = TOC_ROW.findall(source[:end.start()])
    catalog = CATALOG_ROW.findall(args.catalog.read_text(encoding='utf-8'))
    if not toc or not catalog:
        raise SystemExit('No unit rows found; check the text extraction and catalog format.')
    a = {row[0].casefold(): row for row in toc}
    b = {row[0].casefold(): row for row in catalog}
    issues = [f'unrecognized TOC row: {line.strip()}' for line in source[:end.start()].splitlines()
              if TOC_CANDIDATE.match(line) and not TOC_ROW.fullmatch(line)]
    issues.extend(f'duplicate TOC ID: {key}' for key in duplicates(toc))
    issues.extend(f'duplicate catalog ID: {key}' for key in duplicates(catalog))
    issues.extend(f'missing from catalog: {a[key][0]}' for key in sorted(a.keys() - b.keys()))
    issues.extend(f'not in TOC: {b[key][0]}' for key in sorted(b.keys() - a.keys()))
    for key in sorted(a.keys() & b.keys()):
        source_id, source_title, source_page = a[key]
        catalog_id, catalog_title, catalog_page = b[key]
        if source_id != catalog_id:
            issues.append(f'ID spelling: {source_id} != {catalog_id}')
        if source_page != catalog_page:
            issues.append(f'page: {source_id}: {source_page} != {catalog_page}')
        if source_title and normalize_title(source_title) != normalize_title(catalog_title):
            issues.append(f'title: {source_id}: {source_title} != {catalog_title}')
    print(f'TOC units: {len(toc)}; catalog units: {len(catalog)}; issues: {len(issues)}')
    for issue in issues:
        print(issue)
    return int(bool(issues))


if __name__ == '__main__':
    raise SystemExit(main())
