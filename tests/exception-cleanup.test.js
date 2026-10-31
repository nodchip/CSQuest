import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cleanupResult,cleanupPass,createCleanup,stepCleanup,cleanupComplete,restoreCleanup} from '../src/exception-cleanup.js';
test('handling and cleanup are distinct for the exceptional path',()=>{
 for(const handle of [false,true])for(const always of [false,true]){const rules={handle,always};assert.equal(cleanupPass(rules,'normal'),true);assert.equal(cleanupPass(rules,'failure'),handle&&always);const r=cleanupResult(rules,'failure');assert.equal(r.locked,!always);assert.equal(r.status,handle?'handled':'escaped');}assert.throws(()=>cleanupResult({handle:true,always:true},'bad'),RangeError);
});
test('failure must be observed, then both cases retested; history is replayed',()=>{
 let s=createCleanup();for(const a of ['test:failure','rule:handle','rule:always','test:normal','test:failure'])s=stepCleanup(s,a);assert.equal(cleanupComplete(s),true);const copy=restoreCleanup({...s,seenBroken:false});assert.equal(cleanupComplete(copy),true);s=stepCleanup(s,'rule:always');assert.equal(cleanupComplete(s),false);assert.throws(()=>restoreCleanup({history:['rule:bad']}),RangeError);
});
