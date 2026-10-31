import test from 'node:test';
import assert from 'node:assert/strict';
import {bucketFor,createHashQuest,hashAction,restoreHash} from '../src/hash.js';

test('colliding keys share a chain and lookup compares exact keys',()=>{
  const state=restoreHash(['b1','b1','b2','b1','k1','k4','b1','k1','k4','missing']);
  assert.deepEqual(state.buckets,[[],[1,4],[2]]);
  assert.equal(state.phase,'done');assert.equal(state.search,2);
});
test('wrong bucket, skipping a chain entry or claiming absence early cannot advance',()=>{
  let state=createHashQuest();assert.equal(hashAction(state,'b0').inserted,0);
  state=restoreHash(['b1','b1','b2','b1']);
  assert.equal(hashAction(state,'k4').cursor,0);
  assert.equal(hashAction(state,'missing').phase,'compare');
  assert.throws(()=>restoreHash(['b1','b0']),RangeError);
  assert.throws(()=>restoreHash(['b1','b1','b2','b1','missing']),RangeError);
});
test('bucket calculation rejects invalid keys and handles empty buckets',()=>{
  assert.equal(bucketFor(0),0);assert.equal(bucketFor(7),1);
  assert.throws(()=>bucketFor(-1),RangeError);assert.throws(()=>bucketFor(1.5),RangeError);
  assert.throws(()=>restoreHash(Array(11).fill('b1')),RangeError);
});
