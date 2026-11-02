import test from 'node:test';
import assert from 'node:assert/strict';
import {policyCases,policyCreate,policyDone,policyComplete,policyRestore} from '../src/security-policy.js';

test('each policy case requires a checked suitable choice and the reflection',()=>{
 const state=policyCreate();
 for(const [id,item] of Object.entries(policyCases)){
  for(const choice of Object.keys(item.choices))for(const checked of [true,false])assert.equal(policyDone(id,{choice,checked}),checked&&choice===item.answer);
  state.trials[id]={choice:item.answer,checked:true};
 }
 assert.equal(policyComplete(state),false);state.reflection='balance';assert.equal(policyComplete(state),true);
 const copy=policyRestore(state);copy.trials.password.checked=false;assert.equal(policyComplete(copy),false);assert.equal(policyComplete(state),true);
});
test('drafts reject choices outside the selected case and invalid reflection',()=>{
 const state=policyCreate();state.trials.incident.choice='guard';assert.throws(()=>policyRestore(state));state.trials.incident.choice=null;state.reflection='other';assert.throws(()=>policyRestore(state));
});
