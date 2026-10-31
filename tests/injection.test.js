import test from 'node:test';
import assert from 'node:assert/strict';
import {injectionCases,injectionModes,injectionResult,createInjection,restoreInjection,injectionComplete} from '../src/injection.js';

test('each fixed input produces its documented outcome for both constructions',()=>{
  assert.deepEqual(Object.keys(injectionCases).map(id=>[injectionResult('concat',id),injectionResult('bound',id)]),[['blue','blue'],['error','olive'],['all','none']]);
  assert.throws(()=>injectionResult('other','ordinary'),RangeError);
});
test('all six predictions must be checked and correct',()=>{
  const state=createInjection();assert.equal(injectionComplete(state),false);
  for(const id of Object.keys(injectionCases))for(const mode of Object.keys(injectionModes))state.choices[id][mode]={answer:injectionResult(mode,id),checked:true};
  assert.equal(injectionComplete(state),true);state.choices.crafted.bound.answer='all';assert.equal(injectionComplete(state),false);state.choices.crafted.bound.answer='none';state.choices.ordinary.concat.checked=false;assert.equal(injectionComplete(state),false);
});
test('partial draft is copied and invalid choices are rejected',()=>{
  const state=createInjection();state.choices.quote.bound={answer:'olive',checked:true};const saved=restoreInjection(state);state.choices.quote.bound.answer='error';assert.equal(saved.choices.quote.bound.answer,'olive');
  state.choices.quote.bound.answer='missing';assert.throws(()=>restoreInjection(state),RangeError);
});
