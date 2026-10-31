import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gcCases,gcReachable,gcCheck,createGc,restoreGc,gcComplete} from '../src/garbage-collection.js';

test('reachability follows outgoing edges from roots, including an unreachable cycle and incoming edge',()=>{
  assert.deepEqual(gcReachable('chain'),['A','B','C','D']);
  assert.deepEqual(gcReachable('cycle'),['A','B']);
  for(const [id,task] of Object.entries(gcCases)){
    const nodes=Object.keys(task.edges),expected=gcReachable(id);
    for(let mask=0;mask<2**nodes.length;mask++){
      const selected=nodes.filter((_,i)=>mask&(1<<i));
      assert.equal(gcCheck(id,selected),selected.length===expected.length&&selected.every(n=>expected.includes(n)));
    }
  }
});
test('completed trials require valid checked selections and stored selections are copied and validated',()=>{
  const state=createGc();for(const id of Object.keys(gcCases))state.trials[id]={marked:gcReachable(id),checked:true};
  assert.equal(gcComplete(state),true);const restored=restoreGc(state);state.trials.chain.marked.pop();assert.equal(gcComplete(restored),true);
  assert.throws(()=>restoreGc(state),RangeError);restored.trials.cycle.marked.push('C');assert.equal(gcComplete(restored),false);assert.throws(()=>restoreGc(restored),RangeError);
});
