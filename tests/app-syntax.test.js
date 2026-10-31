import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

test('the browser entry point has no conflicting declarations or syntax errors',()=>{
  const app=fileURLToPath(new URL('../src/app.js',import.meta.url));
  const result=spawnSync(process.execPath,['--check',app],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr||result.error?.message);
});
