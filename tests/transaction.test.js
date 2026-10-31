import test from 'node:test';
import assert from 'node:assert/strict';
import {createTransaction,stepTransaction,restoreTransaction,transactionModes} from '../src/transaction.js';
function play(mode,actions){return actions.reduce(stepTransaction,createTransaction(mode));}
test('separate updates retain an incomplete transfer after the interruption',()=>{
  const s=play('separate',['debit','crash']);assert.deepEqual(s.committed,{A:7,B:2});assert.equal(s.status,'done');
});
test('uncommitted work is discarded and a committed transfer survives interruption',()=>{
  const steps=transactionModes.atomic.steps;const pending=play('atomic',steps.slice(0,2));assert.deepEqual(pending.working,{A:7,B:2});assert.deepEqual(pending.committed,{A:10,B:2});
  const recovered=play('atomic',steps.slice(0,3));assert.equal(recovered.working,null);assert.deepEqual(recovered.committed,{A:10,B:2});
  const final=play('atomic',steps);assert.deepEqual(final.committed,{A:7,B:5});assert.equal(final.committed.A+final.committed.B,12);assert.equal(final.status,'done');
});
test('incorrect ordering does not mutate records and restoration replays validated steps',()=>{
  let s=createTransaction('atomic');assert.equal(stepTransaction(s,'debit').index,0);assert.equal(s.committed.A,10);
  const restored=restoreTransaction({selected:'atomic',actions:{separate:['debit','crash'],atomic:['begin','debit','crash']}});assert.deepEqual(restored.states.atomic.committed,{A:10,B:2});
  assert.throws(()=>restoreTransaction({selected:'atomic',actions:{separate:[],atomic:['debit']}}),RangeError);
});
