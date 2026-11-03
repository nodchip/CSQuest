import test from 'node:test';
import assert from 'node:assert/strict';
import {sandboxOriginCreate,sandboxOriginRecord,sandboxOriginDone,sandboxOriginRestore} from '../src/sandbox-origin-lab.js';

test('actual observation, not a fixed expected answer, determines whether the prediction counts',()=>{
 const q=sandboxOriginCreate();q.prediction='yes';assert.equal(sandboxOriginRecord(q,'opaque',false),false);assert.deepEqual(q.seen,[]);
 q.prediction='no';assert.equal(sandboxOriginRecord(q,'opaque',false),true);sandboxOriginRecord(q,'opaque',false);assert.deepEqual(q.seen,['opaque']);
 q.mode='same';q.prediction='yes';assert.equal(sandboxOriginRecord(q,'same',true),true);q.answer='weak';assert.equal(sandboxOriginDone(q),false);q.checked=true;assert.equal(sandboxOriginDone(q),true);
 const r=sandboxOriginRestore(q);r.seen.pop();assert.equal(q.seen.length,2);q.seen.push('same');assert.throws(()=>sandboxOriginRestore(q));
 assert.throws(()=>sandboxOriginRecord(sandboxOriginCreate(),'opaque','false'));
});
