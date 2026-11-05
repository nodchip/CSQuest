import test from 'node:test';
import assert from 'node:assert/strict';
import {aspectLog,aspectComplete,createAspect,restoreAspect} from '../src/aspect-ledger.js';

test('pointcut and advice timing distinguish success, failure and unmatched operations',()=>{
 assert.deepEqual(['deposit','withdraw','failure','read'].map(e=>aspectLog('writes','returning',e)),[true,true,false,false]);
 assert.deepEqual(['deposit','withdraw','failure','read'].map(e=>aspectLog('writes','finally',e)),[true,true,true,false]);
 assert.deepEqual(['deposit','withdraw','failure','read'].map(e=>aspectLog('writes','throwing',e)),[false,false,true,false]);
 assert.deepEqual(['deposit','withdraw','failure','read'].map(e=>aspectLog('all','throwing',e)),[false,false,true,false]);
 assert.deepEqual(['deposit','withdraw','failure','read'].map(e=>aspectLog('all','returning',e)),[true,true,false,true]);
 assert.equal(aspectLog('writes','before','failure'),true);
 assert.throws(()=>aspectLog('invalid','before','read'));
});
test('exception-only advice and its observations survive restoration',()=>{const s=createAspect();s.pointcut='writes';s.advice='throwing';s.done=['failure','read'];assert.deepEqual(restoreAspect(s),s);assert.equal(aspectComplete({...s,checked:true}),false);});
test('completion requires the target configuration and each observation; saved observations are isolated',()=>{
 const s=createAspect();s.pointcut='writes';s.advice='returning';s.done=['deposit','withdraw','failure','read'];s.checked=true;assert.equal(aspectComplete(s),true);
 const copy=restoreAspect(s);copy.done.pop();assert.equal(s.done.length,4);assert.equal(aspectComplete(copy),false);
 assert.throws(()=>restoreAspect({...s,done:['read','read']}));
});
