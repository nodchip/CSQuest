import test from 'node:test';
import assert from 'node:assert/strict';
import {stringRead,stringChoice,createStringStorage,restoreStringStorage} from '../src/string-storage.js';
import {createUtf,restoreUtf} from '../src/utf8.js';
test('length and terminator read the expected bytes from all fixed layouts',()=>{assert.deepEqual(stringRead('empty','length'),[]);assert.deepEqual(stringRead('empty','zero'),[]);assert.equal(stringChoice('plain','length'),'ab');assert.equal(stringChoice('plain','zero'),'ab');assert.equal(stringChoice('zero','length'),'azb');assert.equal(stringChoice('zero','zero'),'a');assert.throws(()=>stringRead('bad','zero'));});
test('old drafts get a new comparison and recorded combinations are validated and copied',()=>{const q=createUtf();delete q.storage;assert.deepEqual(restoreUtf(q).storage,createStringStorage());const s=createStringStorage();s.seen=['empty:zero'];const c=restoreStringStorage(s);c.seen.push('empty:length');assert.deepEqual(s.seen,['empty:zero']);assert.throws(()=>restoreStringStorage({...s,seen:['empty:zero','empty:zero']}));});
