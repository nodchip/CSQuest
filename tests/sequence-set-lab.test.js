import test from 'node:test';
import assert from 'node:assert/strict';
import {sequenceSetValue,sequenceSetNumbers,sequenceSetCases,sequenceSetOptions,sequenceSetCreate,sequenceSetTrialDone,sequenceSetDone,sequenceSetRestore} from '../src/sequence-set-lab.js';

test('sequences preserve position, repetition and positive reciprocals',()=>{
 for(let n=1;n<=100;n++){
  assert.equal(sequenceSetValue('alternateA',n),n%2?1:2);assert.equal(sequenceSetValue('alternateB',n),n%2?2:1);
  assert.equal(sequenceSetValue('constant',n),1);assert.ok(sequenceSetValue('reciprocal',n)>0);
  if(n>1)assert.ok(sequenceSetValue('reciprocal',n)<sequenceSetValue('reciprocal',n-1));
 }
 assert.throws(()=>sequenceSetValue('reciprocal',0));
});
test('each question needs all observations and its own answer',()=>{
 const q=sequenceSetCreate();for(const [id,c] of Object.entries(sequenceSetCases)){
  for(const choice of sequenceSetOptions[id])assert.equal(sequenceSetTrialDone(id,{seen:sequenceSetNumbers,choice,checked:true}),choice===c.answer);
  assert.equal(sequenceSetTrialDone(id,{seen:[1,2],choice:c.answer,checked:true}),false);
  q.trials[id]={seen:[...sequenceSetNumbers],choice:c.answer,checked:true};
 }
 q.answer='rule';assert.equal(sequenceSetDone(q),false);q.answerChecked=true;assert.equal(sequenceSetDone(q),true);
 const copy=sequenceSetRestore(q);copy.trials.order.seen.pop();assert.equal(q.trials.order.seen.length,3);q.trials.order.choice='zero-term';assert.throws(()=>sequenceSetRestore(q));
});
