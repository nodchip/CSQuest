import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';

test('production build serves the workshop adventure at the top and retains old source URLs',async()=>{
  execFileSync(process.execPath,['scripts/build.mjs']);
  const html=await readFile('dist/index.html','utf8');
  assert.match(html,/src="\.\/src\/workshop-preview\.js\?v=region-navigation78"/);
  assert.match(html,/href="\.\/src\/workshop-preview\.css\?v=region-navigation78"/);
  assert.match(html,/id="preview"/);
  assert.doesNotMatch(html,/id="app"/);
  const bundle=await readFile('dist/app.js','utf8');
  assert.ok(bundle.includes('room-scan-privacy'));
  assert.ok((await readFile('dist/src/app.js','utf8')).includes('room-scan-privacy'));
  assert.ok((await readFile('dist/sources.html','utf8')).includes('style.css?v='));
});
