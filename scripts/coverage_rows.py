"""Count explicitly recorded ledger rows, not curriculum completion."""
from collections import Counter
from pathlib import Path

STATES = ('未照合', '部分', '完了')


def count_rows(text: str, source: str) -> Counter:
    counts = Counter()
    state_column = None
    width = None
    tables = 0
    for number, line in enumerate(text.splitlines(), 1):
        if not line.startswith('|'):
            state_column = None
            continue
        cells = [cell.strip() for cell in line.strip().strip('|').split('|')]
        if '状態' in cells:
            if cells.count('状態') != 1:
                raise ValueError(f'{source}:{number}: duplicate status column')
            state_column = cells.index('状態')
            width = len(cells)
            tables += 1
            continue
        if state_column is None:
            continue
        if all(cell and set(cell) <= set('-: ') for cell in cells):
            continue
        if len(cells) != width or cells[state_column] not in STATES:
            raise ValueError(f'{source}:{number}: malformed row or unknown status')
        counts[cells[state_column]] += 1
    if not tables or not sum(counts.values()):
        raise ValueError(f'{source}: no status rows found')
    return counts


def main() -> None:
    paths = sorted(Path('docs').glob('coverage-*.md'))
    paths = [path for path in paths if path.name != 'coverage-status.md']
    if not paths:
        raise SystemExit('No coverage ledgers found; run from the repository root.')
    total = Counter()
    for path in paths:
        counts = count_rows(path.read_text(encoding='utf-8'), str(path))
        total.update(counts)
        print(f'{path.name}: ' + ', '.join(f'{state}={counts[state]}' for state in STATES))
    print(f'台帳ファイル数: {len(paths)}')
    print('記録行数: ' + ', '.join(f'{state}={total[state]}' for state in STATES))
    print('親子の重複とトピック・成果の両方を含む行数。完成率や原典との一致を示さない。')


if __name__ == '__main__':
    main()
