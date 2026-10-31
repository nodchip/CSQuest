import test from 'node:test';
import assert from 'node:assert/strict';
import {createHornSearch,createHornSearchTrial,stepHornSearch,hornSearchComplete,restoreHornSearch} from '../src/horn-search.js';

test('search checks both choices, rolls back and distinguishes a solution from failure',()=>{
  const all=createHornSearch();
  for(const id of ['star','fountain']){
    let s=createHornSearchTrial(id);assert.equal(stepHornSearch(s,'finish').history.length,0);
    for(const choice of ['b','d']){s=stepHornSearch(s,choice);s=stepHornSearch(s,'inspect');assert.equal(stepHornSearch(s,choice).history.length,s.history.length);s=stepHornSearch(s,'backtrack');assert.equal(s.candidate,null);}
    s=stepHornSearch(s,'finish');assert.equal(s.phase,'done');assert.deepEqual(s.solutions,id==='star'?['d']:[]);all.trials[id]=s;
  }
  assert.equal(hornSearchComplete(all),true);
});
test('search also accepts reverse candidate order and validates saved histories',()=>{
  const histories={star:['d','inspect','backtrack','b','inspect','backtrack','finish'],fountain:['b','inspect']};
  const state=restoreHornSearch({selected:'fountain',histories});assert.deepEqual(state.trials.star.solutions,['d']);assert.equal(state.trials.fountain.phase,'return');
  assert.throws(()=>restoreHornSearch({selected:'star',histories:{...histories,star:['b','backtrack']}}));
  assert.throws(()=>restoreHornSearch({selected:'star',histories:{...histories,star:['b','inspect','backtrack','b']}}));
});
