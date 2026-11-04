import sys
import unittest
import csv
import copy
import tempfile
from unittest.mock import patch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from coverage_rows import count_rows
from coverage_inventory import parse_inventory, validate_audits, COLUMNS


class CoverageRowsTest(unittest.TestCase):
    def test_varied_columns_and_parent_rows(self):
        text = '''| 番号 | 状態 | 説明 |
|---|---|---|
| 1 | 部分 | 親 |
| 1a | 未照合 | 子 |

| 番号 | 区分 | 要約 | 状態 |
|---|---|---|---|
| 1 | CS Core | 成果 | 完了 |
'''
        self.assertEqual(count_rows(text, 'fixture'), {'部分': 1, '未照合': 1, '完了': 1})

    def test_invalid_status_or_column_count_fails(self):
        for row in ('| 1 | 不明 |', '| 1 | 部分 | 余分 |'):
            with self.subTest(row=row), self.assertRaises(ValueError):
                count_rows('| 番号 | 状態 |\n|---|---|\n' + row, 'fixture')

    def test_missing_table_fails(self):
        with self.assertRaises(ValueError):
            count_rows('台帳なし', 'fixture')


class CoverageInventoryTest(unittest.TestCase):
    def fixture(self, root, content):
        docs = Path(root) / 'docs'
        docs.mkdir()
        (docs / 'coverage-zz-example.md').write_text(content, encoding='utf-8')

    @patch('coverage_inventory.unit_list', return_value=[('ZZ', 'ZZ-Example')])
    def test_category_parent_detection_and_implicit_core(self, _):
        with tempfile.TemporaryDirectory() as root:
            self.fixture(root, '# ZZ-Example\n## トピック\n| 番号 | 要約 | 状態 | 残り |\n|---|---|---|---|\n| 1 | 親の範囲 | 部分 | 限界あり |\n| 1a | 子 | 未照合 | 未確認 |\n| 1a-i | 孫一 | 部分 | 限界 |\n| 1a-ii | 孫二 | 部分 | 限界 |\n## 例示学習成果\n| 番号 | 区分 | 要約 | 状態 | 残り |\n|---|---|---|---|---|\n| 1 | KA Core | 成果 | 部分 | 限界あり |\n')
            rows = parse_inventory(root)
        self.assertEqual([r['種別'] for r in rows], ['トピック', 'トピック', 'トピック', 'トピック', '学習成果'])
        self.assertIn('親子重複候補', rows[0]['要確認'])
        self.assertIn('親子重複候補', rows[1]['要確認'])
        self.assertNotIn('親子重複候補', rows[2]['要確認'])
        self.assertNotIn('親子重複候補', rows[4]['要確認'])
        self.assertIn('区分を要確認', rows[0]['要確認'])
        self.assertEqual(rows[0]['行'], '5')

    @patch('coverage_inventory.unit_list', return_value=[('ZZ', 'ZZ-Example')])
    def test_duplicate_identifiers_and_unknown_state(self, _):
        with tempfile.TemporaryDirectory() as root:
            self.fixture(root, '# ZZ-Example\n## トピック\n| 番号 | 要約 | 状態 | 残り |\n|---|---|---|---|\n| 1 | 一つ | 部分 | 限界 |\n| 1 | 別 | 部分 | 限界 |\n')
            rows = parse_inventory(root)
            self.assertTrue(all('候補ID重複' in row['要確認'] for row in rows))
            path = Path(root) / 'docs' / 'coverage-zz-example.md'
            path.write_text(path.read_text(encoding='utf-8').replace('部分', '不明'), encoding='utf-8')
            with self.assertRaises(ValueError):
                parse_inventory(root)

    def test_scope_audit_rejects_changes_but_allows_status_updates(self):
        root = Path(__file__).resolve().parents[1]
        rows = parse_inventory(root)
        audits = root / 'docs/curriculum-audits.json'
        self.assertGreaterEqual(validate_audits(root, rows, audits), 3)
        changed = copy.deepcopy(rows)
        row = next(r for r in changed if r['知識単位'] == 'SPD-Web')
        row['台帳状態'] = '完了'
        self.assertGreaterEqual(validate_audits(root, changed, audits), 3)
        row['要約'] += ' changed'
        with self.assertRaises(ValueError):
            validate_audits(root, changed, audits)
        with self.assertRaises(ValueError):
            validate_audits(root, [r for r in rows if r['候補ID'] != row['候補ID']], audits)

    def test_checked_in_draft_matches_current_ledger(self):
        root = Path(__file__).resolve().parents[1]
        with (root / 'docs/curriculum-inventory-draft.csv').open(encoding='utf-8-sig', newline='') as source:
            reader = csv.DictReader(source)
            self.assertEqual(reader.fieldnames, list(COLUMNS))
            self.assertEqual(list(reader), parse_inventory(root))


if __name__ == '__main__':
    unittest.main()
