import test from 'node:test';
import assert from 'node:assert/strict';
import {priorityInterruptReplay,priorityInterruptStep,priorityInterruptCreate,priorityInterruptComplete,priorityInterruptRestore} from '../src/interrupt-priority.js';
const add=(mode,h,action)=>{const r=priorityInterruptStep(mode,h,action);assert.equal(r.ok,true,action);return r.history;};

test('vector choice, deferred handling, nested preemption and return order',()=>{
 const q=priorityInterruptCreate();
 for(const mode of ['flat','nested']){
  let h=[];h=add(mode,h,'arrive:low');assert.equal(priorityInterruptStep(mode,h,'vector:48').ok,false);h=add(mode,h,'vector:32');h=add(mode,h,'arrive:high');
  assert.equal(priorityInterruptStep(mode,h,`predict:${mode==='flat'?'high':'low'}`).ok,false);h=add(mode,h,`predict:${mode==='flat'?'low':'high'}`);
  if(mode==='flat'){
   assert.equal(priorityInterruptStep(mode,h,'vector:48').ok,false);h=add(mode,h,'finish');assert.deepEqual(priorityInterruptReplay(mode,h).pending,['high']);h=add(mode,h,'vector:48');h=add(mode,h,'finish');assert.deepEqual(priorityInterruptReplay(mode,h).finished,['low','high']);
  }else{
   assert.equal(priorityInterruptStep(mode,h,'finish').ok,false);h=add(mode,h,'vector:48');assert.deepEqual(priorityInterruptReplay(mode,h).stack,['low','high']);h=add(mode,h,'finish');assert.deepEqual(priorityInterruptReplay(mode,h).stack,['low']);h=add(mode,h,'finish');assert.deepEqual(priorityInterruptReplay(mode,h).finished,['high','low']);
  }
  assert.equal(priorityInterruptReplay(mode,h).done,true);q.trials[mode]=h;
 }
 assert.equal(priorityInterruptComplete(q),false);q.reflection='scope';assert.equal(priorityInterruptComplete(q),true);const copy=priorityInterruptRestore(q);copy.trials.flat.pop();assert.equal(priorityInterruptComplete(copy),false);assert.equal(priorityInterruptComplete(q),true);
});
test('replay rejects skipped arrivals, incorrect priorities and duplicate operations',()=>{
 assert.throws(()=>priorityInterruptReplay('flat',['vector:32']));assert.throws(()=>priorityInterruptReplay('flat',['arrive:low','arrive:low']));assert.throws(()=>priorityInterruptReplay('nested',['arrive:low','vector:32','arrive:high','predict:low']));
});
