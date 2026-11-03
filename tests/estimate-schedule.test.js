import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateTasks,estimateRuns,estimateDuration,estimateReplay,estimateCreate,estimateRestore,estimateDone} from '../src/estimate-schedule.js';
const parallel=['A','tick','B','C','tick','tick','D','tick'],single=['A','tick','B','tick','C','tick','D','tick'];
test('three estimates, dependencies, workers and fixed actuals yield expected durations',()=>{
 assert.deepEqual(estimateTasks.map(t=>estimateDuration(t,false)),[2,2,3,2]);assert.deepEqual(estimateTasks.map(t=>estimateDuration(t,true)),[3,2,4,3]);
 for(const [i,history] of [[0,parallel],[1,parallel],[2,single]]){const r=estimateReplay(i,history);assert.equal(r.done,true);assert.equal(r.time,estimateRuns[i].target);assert.equal(r.work,i===1?12:9);}
 assert.throws(()=>estimateReplay(0,['B']));assert.throws(()=>estimateReplay(0,['tick']));assert.throws(()=>estimateReplay(2,['A','B']));assert.throws(()=>estimateReplay(0,['A','tick','D']));
});
test('enumerating all legal event sequences confirms the minimum completion times',()=>{
 for(let i=0;i<estimateRuns.length;i++){
  const queue=[[]],times=[];
  while(queue.length){const h=queue.pop(),r=estimateReplay(i,h);if(r.done){times.push(r.time);continue;}for(const event of ['A','B','C','D','tick']){const next=[...h,event];try{estimateReplay(i,next);queue.push(next);}catch{/* not a legal next action */}}}
  assert.ok(times.length>0);assert.equal(Math.min(...times),estimateRuns[i].target);
  if(i!==2)assert.ok(times.some(t=>t>estimateRuns[i].target));
 }
});
test('all three reproducible schedules and both interpretations are needed',()=>{
 const q=estimateCreate();q.histories=[parallel,parallel,single];q.seen=estimateRuns.map(x=>x.id);q.reflection='different';q.risk='range';assert.equal(estimateDone(q),true);const copy=estimateRestore(q);copy.histories[0].pop();assert.equal(q.histories[0].length,8);assert.throws(()=>estimateRestore({...q,histories:[[],parallel,single]}));
});
