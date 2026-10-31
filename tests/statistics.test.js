import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleSummary,createStatistics,addRecord,restoreStatistics,statisticsComplete} from '../src/statistics.js';

test('the changed extreme shifts the mean but not the median',()=>{
  assert.deepEqual(sampleSummary('regular'),{sorted:[1,2,3,4,5,6,7],mean:4,median:4});
  assert.deepEqual(sampleSummary('delayed'),{sorted:[1,2,3,4,5,6,28],mean:7,median:4});
});
test('ordering accepts the next smallest record and rejects skipping it',()=>{
  let state=createStatistics().states.regular;assert.equal(addRecord(state,'regular',4).state.order.length,0);
  for(const value of [1,2,3,4,5,6,7])state=addRecord(state,'regular',value).state;
  assert.deepEqual(state.order,[1,2,3,4,5,6,7]);assert.throws(()=>addRecord(state,'regular',1),RangeError);
});
test('independent trials resume only reachable selections and require checked answers',()=>{
  const state=createStatistics();state.states.regular={order:[1,2,3,4,5,6,7],mean:4,median:4,tested:true};state.states.delayed={order:[1,2,3,4,5,6,28],mean:7,median:4,tested:true};
  assert.equal(statisticsComplete(state),true);const restored=restoreStatistics(state);state.states.regular.order[0]=7;assert.equal(restored.states.regular.order[0],1);
  restored.states.regular.order=[1,3];assert.throws(()=>restoreStatistics(restored),RangeError);
});
