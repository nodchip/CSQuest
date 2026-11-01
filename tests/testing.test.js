import test from 'node:test';
import assert from 'node:assert/strict';
import {sizes,createTesting,toggleCase,runTests,caught,testingComplete,restoreTesting} from '../src/testing.js';

test('boundary tests detect two independent mistakes and correct gate matches specification',()=>{
  let state=createTesting();for(const n of [1,6])state=toggleCase(state,n);state=runTests(state);
  assert.equal(testingComplete(state),false);assert.equal(caught(state.results,'correct'),false);
  assert.equal(caught(state.results,'lower'),true);assert.equal(caught(state.results,'upper'),true);
  assert.deepEqual(state.results.map(x=>x.expected),[true,false]);
});
test('interior tests do not expose boundary errors and changing tests invalidates results',()=>{
  let state=toggleCase(createTesting(),2);state=runTests(state);assert.equal(testingComplete(state),false);
  state=toggleCase(state,1);assert.equal(state.results,null);assert.equal(testingComplete(state),false);
  state=toggleCase(state,5);assert.deepEqual(toggleCase(state,6).selected,[1,2,5]);
});
test('restore validates input and recomputes results from selected examples',()=>{
  let state=restoreTesting({selected:[6,1],ran:true});assert.equal(caught(state.results,'lower'),true);assert.equal(caught(state.results,'upper'),true);assert.equal(testingComplete(state),false);
  assert.throws(()=>restoreTesting({selected:[1,1],ran:false}),RangeError);
  assert.throws(()=>restoreTesting({selected:[],ran:true}),RangeError);
  assert.throws(()=>toggleCase(createTesting(),7),RangeError);
  for(const n of sizes){const row=runTests(toggleCase(createTesting(),n)).results[0];assert.equal(row.expected,n>=1&&n<=5);}
});
