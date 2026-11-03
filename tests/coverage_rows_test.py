import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from coverage_rows import count_rows


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


if __name__ == '__main__':
    unittest.main()
