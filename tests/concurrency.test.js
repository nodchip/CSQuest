import test from 'node:test';
import assert from 'node:assert/strict';
import {createTrial,stepWorker} from '../src/concurrency.js';

function execute(sequence,observed=[]) {let state=createTrial(observed);for(const id of sequence)state=stepWorker(state,id);return state;}

test('two reads before either write lose one increment',()=>{
  const state=execute(['A','B','A','B']);
  assert.equal(state.done,true);assert.equal(state.value,1);assert.deepEqual(state.observed,[1]);
});
test('finishing one worker before the other preserves both increments',()=>{
  const first=execute(['A','A','B','B']);
  assert.equal(first.value,2);assert.deepEqual(first.observed,[2]);
  const both=execute(['B','A','B','A'],first.observed);
  assert.deepEqual(both.observed,[2,1]);
});
test('all valid interleavings produce one or two and preserve worker order',()=>{
  for(const sequence of ['AABB','ABAB','ABBA','BAAB','BABA','BBAA']) {
    const state=execute([...sequence]);
    assert.ok([1,2].includes(state.value));assert.equal(state.log.length,4);
  }
  let state=execute(['A','A']);
  assert.throws(()=>stepWorker(state,'A'),RangeError);
  assert.throws(()=>stepWorker(state,'C'),RangeError);
});
