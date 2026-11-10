import argparse
import json
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class ModuleScripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sources = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script' and attrs.get('type') == 'module' and attrs.get('src'):
            self.sources.append(attrs['src'])


# A deliberately limited textual scan, not a JavaScript parser. Dynamic imports
# and inline scripts are excluded; comments and strings can yield false edges.
STATIC_IMPORT = re.compile(
    r"\b(?:import\s*(?:[\w*$\s{},]+\s+from\s*)?|export\s+(?:\*|\{[^}]*\})(?:\s+as\s+\w+)?\s+from\s*)[\"']([^\"']+)[\"']",
    re.MULTILINE,
)


def local_path(root, base, specifier):
    url = urlsplit(specifier)
    if url.scheme or url.netloc or not url.path.startswith(('./', '../')):
        return None
    path = (base / unquote(url.path)).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f'Path outside repository: {specifier}')
    return path


def inspect(root):
    root = Path(root).resolve()
    parser = ModuleScripts()
    parser.feed((root / 'index.html').read_text(encoding='utf-8'))
    if not parser.sources:
        raise ValueError('No external module script found in index.html')
    pending = []
    for source in parser.sources:
        path = local_path(root, root, source)
        if path is None:
            raise ValueError(f'Unsupported entry: {source}')
        pending.append(path)
    visited = set()
    unresolved = set()
    while pending:
        path = pending.pop()
        if path in visited:
            continue
        if not path.is_file():
            unresolved.add(path.relative_to(root).as_posix())
            continue
        visited.add(path)
        for specifier in STATIC_IMPORT.findall(path.read_text(encoding='utf-8')):
            target = local_path(root, path.parent, specifier)
            if target is not None:
                pending.append(target)
            else:
                unresolved.add(f'{path.relative_to(root).as_posix()}: {specifier}')
    graph = {path.relative_to(root).as_posix() for path in visited}
    assessments = json.loads((root / 'docs/curriculum-assessments.json').read_text(encoding='utf-8'))['items']
    rows = []
    for key, item in sorted(assessments.items()):
        sources = sorted(name for name in item['files'] if name.startswith('src/') and name.endswith('.js'))
        found = sorted(set(sources) & graph)
        rows.append({'item': key, 'recorded_status': item['status'], 'recorded_sources': sources,
                     'sources_in_static_graph': found})
    return {'entry_scripts': parser.sources, 'static_graph_modules': sorted(graph),
            'unresolved_static_imports': sorted(unresolved), 'assessments': rows}


def main():
    parser = argparse.ArgumentParser(description='Compare historical assessment sources with a limited static import scan.')
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    result = inspect(args.root)
    counts = Counter('記載ソースの一部がグラフ内' if row['sources_in_static_graph'] else '到達性未確認'
                     for row in result['assessments'])
    print(json.dumps({'summary': {'assessments': len(result['assessments']), 'classification': counts}, **result},
                     ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
