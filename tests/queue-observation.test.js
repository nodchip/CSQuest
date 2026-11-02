import test from 'node:test';
import assert from 'node:assert/strict';
import {queueJobs,observeQueue,queueObservationCreate,queueObservationComplete,queueObservationRestore} from '../src/queue-observation.js';

test('the six intervals conserve arrivals and account for unfinished time',()=>{
 const result=observeQueue();assert.deepEqual(result.rows.map(row=>row.inSystem),[1,2,2,1,2,1]);assert.equal(result.area,9);
 assert.deepEqual(result.completed.map(job=>[job.id,job.finish,job.sojourn]),[['甲',2,2],['乙',3,2],['丙',5,3]]);
 assert.deepEqual(result.unfinished.map(job=>[job.id,job.elapsed]),[['丁',2]]);
 assert.equal(result.completed.length+result.unfinished.length,queueJobs.length);assert.equal(result.area,result.completedTime+result.unfinishedTime);assert.deepEqual([result.completedTime,result.unfinishedTime],[7,2]);
});
test('the full trace, both accounting answers and the reflection are required and restored safely',()=>{
 const s=queueObservationCreate();s.area='nine';s.unfinished='two';s.checked=true;s.reflection='boundary';assert.equal(queueObservationComplete(s),false);s.step=6;assert.equal(queueObservationComplete(s),true);const restored=queueObservationRestore(s);restored.area='seven';assert.equal(queueObservationComplete(restored),false);assert.equal(queueObservationComplete(s),true);
 assert.throws(()=>queueObservationRestore({...s,step:5}));assert.throws(()=>queueObservationRestore({...s,unfinished:'missing'}));
});
