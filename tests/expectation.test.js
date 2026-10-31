import test from 'node:test';
import assert from 'node:assert/strict';
import {chestStats,createExpectation,restoreExpectation,expectationComplete} from '../src/expectation.js';

test('equally likely outcomes give equal averages but different chances of zero',()=>{
  assert.deepEqual(chestStats('steady'),{average:3,zero:0,total:4});
  assert.deepEqual(chestStats('rare'),{average:3,zero:3,total:4});
  assert.deepEqual(chestStats('higher'),{average:4,zero:3,total:4});
  assert.throws(()=>chestStats('missing'),RangeError);
});
test('all results need correct checked answers and restore independently',()=>{
  const state=createExpectation();
  for(const [id,average,zero] of [['steady',3,0],['rare',3,3],['higher',4,3]])state.choices[id]={average,zero,tested:true};
  assert.equal(expectationComplete(state),true);const saved=restoreExpectation(state);state.choices.rare.zero=0;assert.equal(expectationComplete(state),false);assert.equal(saved.choices.rare.zero,3);
  saved.choices.rare.average=99;assert.throws(()=>restoreExpectation(saved),RangeError);
});
