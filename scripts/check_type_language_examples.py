"""Verify the four fixed examples with the local Python and Rust compilers."""
import pathlib
import subprocess
import sys
import tempfile

print(subprocess.run(['rustc', '--version'], capture_output=True, text=True, check=True).stdout.strip())
print('Python', sys.version.split()[0])
with tempfile.TemporaryDirectory() as temp:
    path = pathlib.Path(temp)
    for enabled in (False, True):
        flag = str(enabled).lower()
        rust = f'fn main() {{ if {flag} {{ let _ = 1 + "x"; }} println!("done"); }}'
        source = path / 'sample.rs'
        source.write_text(rust, encoding='utf-8')
        result = subprocess.run(['rustc', '--emit=metadata', str(source), '-o', str(path / 'sample.rmeta')], capture_output=True, text=True)
        assert result.returncode != 0 and 'E0277' in result.stderr, result.stderr
        python = f'if {enabled}:\n    value = 1 + "x"\nprint("done")\n'
        result = subprocess.run([sys.executable, '-c', python], capture_output=True, text=True)
        if enabled:
            assert result.returncode != 0 and 'TypeError' in result.stderr and not result.stdout, result.stderr
        else:
            assert result.returncode == 0 and result.stdout.strip() == 'done', result.stderr
        print(f'branch={flag}: Rust rejected; Python {"TypeError" if enabled else "done"}')
