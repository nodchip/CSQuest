import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'scripts'))
from adventure_coverage_join import ASSESSMENT_COLUMNS, join_rows


def item(key='X:トピック:CS Core:1', unit='X', number='1', flags='親子重複候補'):
    return {'候補ID': key, '分野': 'X', '知識単位': unit, '種別': 'トピック',
            '区分': 'CS Core', '原典番号': number, '要約': '範囲', '台帳': 'coverage-x.md',
            '行': '1', '要確認': flags, '台帳状態': '完了', '根拠と残る範囲': '旧教材'}


def evaluation(key, quest):
    return {'候補ID': key, **dict(zip(ASSESSMENT_COLUMNS,
        [quest, '部分対応', '残る範囲', '到達根拠', '検証', 'レビュー']))}


class JoinTests(unittest.TestCase):
    def test_multiple_assessments_and_unassessed_old_record(self):
        a, b = item(), item('X:トピック:CS Core:2', number='2')
        rows = join_rows([a, b], [evaluation(a['候補ID'], 'one'), evaluation(a['候補ID'], 'two')],
                         {'X': {'document': 'docs/audit.md'}})
        self.assertEqual([r['冒険の依頼ID'] for r in rows], ['one', 'two', ''])
        self.assertEqual(rows[0]['学習成果と残る範囲'], '残る範囲')
        self.assertEqual(rows[0]['要確認'], '親子重複候補')
        self.assertEqual(rows[-1]['現行冒険の評価'], '評価未作成')
        self.assertEqual(rows[-1]['教材の状態'], '')

    def test_unmatched_id_and_duplicate_inventory_fail(self):
        a = item()
        with self.assertRaises(ValueError):
            join_rows([a], [evaluation('unknown', 'quest')], {})
        with self.assertRaises(ValueError):
            join_rows([a, a], [], {})

    def test_unverified_and_known_auxiliary(self):
        a = item('GIT-Shading:トピック:KA Core:2a', 'GIT-Shading', '2a')
        row = join_rows([a], [], {})[0]
        self.assertEqual(row['原典照合状態'], '未照合')
        self.assertIn('便宜的分割', row['便宜的分割の注意'])


if __name__ == '__main__':
    unittest.main()
