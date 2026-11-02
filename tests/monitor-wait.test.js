import {test} from 'node:test';
import assert from 'node:assert/strict';
import {monitorModes,monitorSequences,monitorReplay,monitorCreate,monitorStep,monitorComplete,monitorRestore} from '../src/monitor-wait.js';

test('waiting releases the monitor lock; signalling alone does not',()=>{
 const held=monitorReplay('hold',monitorSequences.hold);assert.equal(held.lock,'A');assert.equal(held.b,'鍵待ち');assert.equal(held.items,0);
 const seq=monitorSequences.release;
 assert.equal(monitorReplay('release',seq.slice(0,2)).lock,'空き');
 const notified=monitorReplay('release',seq.slice(0,6));assert.equal(notified.lock,'B');assert.equal(notified.a,'通知済み・鍵待ち');assert.equal(notified.items,1);
 const resumed=monitorReplay('release',seq.slice(0,8));assert.equal(resumed.lock,'A');assert.equal(resumed.checked,false);
 const end=monitorReplay('release',seq);assert.equal(end.lock,'空き');assert.equal(end.a,'完了');assert.equal(end.items,0);assert.equal(end.checked,true);
 assert.throws(()=>monitorReplay('release',['enterA','wait','put']));
});
test('both examples and the reflection are required and histories are validated on restore',()=>{
 const q=monitorCreate();for(const m of Object.keys(monitorModes)){q.mode=m;for(const action of monitorSequences[m]){monitorStep(q,action);assert.deepEqual(monitorRestore(q),q);}}
 assert.equal(monitorComplete(q),false);q.answer='release';assert.equal(monitorComplete(q),true);const bad=structuredClone(q);bad.histories.release[3]='signal';assert.throws(()=>monitorRestore(bad));
});
