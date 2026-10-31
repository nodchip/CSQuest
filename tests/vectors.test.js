import test from 'node:test';
import assert from 'node:assert/strict';
import {anchor,rays,dot,checkVector,createVectors,restoreVectors,vectorsComplete} from '../src/vectors.js';

test('the dot product correctly classifies the three nonzero directions',()=>{
  assert.equal(dot(anchor,rays.sun.vector),2);assert.equal(dot(anchor,rays.moon.vector),0);assert.equal(dot(anchor,rays.shadow.vector),-5);
  for(const ray of Object.values(rays))assert.equal(dot(anchor,ray.vector),dot(ray.vector,anchor));
  assert.throws(()=>dot([1,2],[3]),RangeError);
});
test('each challenge needs both the correct direction and its calculated value',()=>{
  const state=createVectors();for(const [id,ray,value] of [['positive','sun',2],['zero','moon',0],['negative','shadow',-5]])state.choices[id]={ray,value,tested:true};
  assert.equal(vectorsComplete(state),true);state.choices.zero.value=2;assert.equal(checkVector('zero',state.choices.zero).value,false);assert.equal(vectorsComplete(state),false);
});
test('saved independent trials are validated and copied',()=>{
  const state=createVectors();state.choices.zero.ray='moon';const restored=restoreVectors(state);state.choices.zero.ray='sun';assert.equal(restored.choices.zero.ray,'moon');
  restored.choices.positive.value=100;assert.throws(()=>restoreVectors(restored),RangeError);
});
