import test from 'node:test';
import assert from 'node:assert/strict';
import {wannacryEvidence,wannacryQuestions,wannacryCreate,wannacryTrialDone,wannacryComplete,wannacryRestore} from '../src/wannacry-evidence.js';

test('each report finding requires its relevant evidence and bounded conclusion',()=>{
 const s=wannacryCreate();
 for(const [id,q] of Object.entries(wannacryQuestions)){
  assert.ok(Object.hasOwn(wannacryEvidence,q.evidence));assert.ok(Object.hasOwn(q.choices,q.answer));
  for(const evidence of Object.keys(wannacryEvidence))for(const answer of Object.keys(q.choices))for(const checked of [false,true]){
   assert.equal(wannacryTrialDone(id,{evidence,answer,checked}),checked&&evidence===q.evidence&&answer===q.answer);
  }
  s.trials[id]={evidence:q.evidence,answer:q.answer,checked:true};
 }
 assert.equal(wannacryComplete(s),false);s.reflection='uncertainty';assert.equal(wannacryComplete(s),true);
 const copy=wannacryRestore(s);copy.trials.care.answer='exact';assert.equal(wannacryComplete(copy),false);assert.equal(wannacryComplete(s),true);
});
test('draft validation rejects unknown evidence and choices',()=>{
 const s=wannacryCreate();s.trials.scope.evidence='unknown';assert.throws(()=>wannacryRestore(s));s.trials.scope.evidence='scope';s.trials.scope.answer='exact';assert.throws(()=>wannacryRestore(s));
});
