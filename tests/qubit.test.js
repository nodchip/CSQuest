import test from 'node:test';
import assert from 'node:assert/strict';
import {runQubit,qubitCases,qubitCorrect,createQubit,restoreQubit} from '../src/qubit.js';

test('H, phase and nonselective measurement produce the expected probability distributions',()=>{
  assert.deepEqual(runQubit('identity'),[[0.5,0.5,0.5],[0.5,0.5,0.5],[1,0,0]]);
  assert.deepEqual(runQubit('phase'),[[0.5,0.5,0.5],[0.5,-0.5,0.5],[0,0,1]]);
  assert.deepEqual(runQubit('measure'),[[0.5,0.5,0.5],[0.5,0,0.5],[0.5,0,0.5]]);
  // Applying H independently to the two equally likely collapsed basis states
  // gives equal probabilities in each branch and hence in their mixture.
  for(const operation of ['identity','phase','measure'])for(const [a,b,d] of runQubit(operation)){
    assert.equal(a+d,1);assert.ok(a>=0&&d>=0&&a*d-b*b>=0);
  }
  assert.throws(()=>runQubit('unknown'),RangeError);
});
test('each case requires its operation and its calculated probability',()=>{
  for(const [id,{operation}] of Object.entries(qubitCases))for(const op of ['identity','phase','measure'])for(const p of [0,0.5,1]){
    assert.equal(qubitCorrect(id,{operation:op,probability:p}),op===operation&&p===runQubit(op)[2][0]);
  }
});
test('drafts restore only valid, internally consistent selections',()=>{
  const state=createQubit();state.choices.restore={operation:'identity',probability:1,checked:true,solved:true};
  assert.deepEqual(restoreQubit(state),state);
  state.choices.restore.probability=0;assert.throws(()=>restoreQubit(state),RangeError);
  state.choices.restore.solved=false;state.choices.restore.operation='unknown';assert.throws(()=>restoreQubit(state),RangeError);
});
