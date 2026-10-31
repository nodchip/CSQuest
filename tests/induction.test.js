import test from 'node:test';
import assert from 'node:assert/strict';
import {inductionSteps,createInduction,inductionStep,restoreInduction} from '../src/induction.js';

test('the illustrated construction agrees with the first 1000 finite cases',()=>{
  let total=0;for(let n=1;n<=1000;n++){total+=2*n-1;assert.equal(total,n*n);assert.equal(n*n+(2*n+1),(n+1)*(n+1));}
});
test('each correct choice advances once and incorrect choices keep the proof at its step',()=>{
  let state=createInduction();for(const item of inductionSteps){for(const id of Object.keys(item.options).filter(id=>id!==item.answer)){const wrong=inductionStep(state,id);assert.equal(wrong.step,state.step);assert.deepEqual(wrong.history,state.history);}state=inductionStep(state,item.answer);}
  assert.equal(state.step,inductionSteps.length);assert.deepEqual(restoreInduction(state.history),state);assert.throws(()=>inductionStep(state,'base'),RangeError);
});
test('restoration rejects incorrect or excess proof steps',()=>{
  assert.throws(()=>restoreInduction(['two']),RangeError);assert.throws(()=>restoreInduction(['base','future']),RangeError);assert.throws(()=>restoreInduction([...inductionSteps.map(x=>x.answer),'base']),RangeError);
});
