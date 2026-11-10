import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from assessment_static_graph import inspect


class StaticGraphTest(unittest.TestCase):
    def test_entry_static_imports_and_assessment_sources(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'src').mkdir()
            (root / 'docs').mkdir()
            (root / 'index.html').write_text('<script type="module" src="./src/start.js?v=1"></script>', encoding='utf-8')
            (root / 'src/start.js').write_text(
                "import {x} from './child.js?v=2';\nimport './side.js';\nimport('./dynamic.js');", encoding='utf-8')
            (root / 'src/child.js').write_text("export * from './leaf.js';", encoding='utf-8')
            (root / 'src/leaf.js').write_text('', encoding='utf-8')
            (root / 'src/side.js').write_text('', encoding='utf-8')
            (root / 'src/dynamic.js').write_text('', encoding='utf-8')
            items = {'a': {'status': '完了', 'files': {'src/leaf.js': '', 'tests/a.js': ''}},
                     'b': {'status': '部分', 'files': {'src/dynamic.js': ''}}}
            (root / 'docs/curriculum-assessments.json').write_text(json.dumps({'items': items}), encoding='utf-8')
            result = inspect(root)
            self.assertEqual(result['static_graph_modules'], ['src/child.js', 'src/leaf.js', 'src/side.js', 'src/start.js'])
            self.assertEqual(result['assessments'][0]['sources_in_static_graph'], ['src/leaf.js'])
            self.assertEqual(result['assessments'][1]['sources_in_static_graph'], [])
            self.assertEqual(result['unresolved_static_imports'], [])

    def test_missing_import_is_reported(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'src').mkdir()
            (root / 'docs').mkdir()
            (root / 'index.html').write_text('<script type="module" src="./src/start.js"></script>', encoding='utf-8')
            (root / 'src/start.js').write_text("import './missing.js';", encoding='utf-8')
            (root / 'docs/curriculum-assessments.json').write_text('{"items": {}}', encoding='utf-8')
            self.assertEqual(inspect(root)['unresolved_static_imports'], ['src/missing.js'])


if __name__ == '__main__':
    unittest.main()
