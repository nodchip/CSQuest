import test from 'node:test';
import assert from 'node:assert/strict';
import {createTransaction,stepTransaction,predictTransactionCrash,restoreTransaction,transactionModes} from '../src/transaction.js';
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
test('each interruption requires the correct prediction and wrong answers preserve progress',()=>{
  const cases=[
    {mode:'separate',actions:['debit'],answer:'partial',result:{A:7,B:2}},
    {mode:'atomic',actions:['begin','debit'],answer:'original',result:{A:10,B:2}},
    {mode:'atomic',actions:['begin','debit','crash','recover','begin','debit','credit','commit'],answer:'transferred',result:{A:7,B:5}}
  ];
  for(const {mode,actions,answer,result} of cases){
    const state=play(mode,actions);
    for(const guess of ['original','partial','transferred'].filter(g=>g!==answer)){
      const wrong=predictTransactionCrash(state,guess);assert.equal(wrong.index,state.index);assert.deepEqual(wrong.committed,state.committed);assert.match(wrong.message,/その台帳にはなりません/);
    }
    const correct=predictTransactionCrash(state,answer);assert.equal(correct.index,state.index+1);assert.deepEqual(correct.committed,result);
  }
  assert.throws(()=>predictTransactionCrash(createTransaction('atomic'),'original'),RangeError);
});
