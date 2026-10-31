import test from 'node:test';
import assert from 'node:assert/strict';
import {original,transform,applySequence,matches,createTransform,restoreTransform,transformComplete} from '../src/transform.js';

test('translation and rotation have different results when their order changes',()=>{
  assert.deepEqual(applySequence(['move','rotate']),[[0,2],[0,3],[-1,2]]);
  assert.deepEqual(applySequence(['rotate','move']),[[1,1],[1,2],[0,1]]);
  assert.deepEqual(original,[[1,0],[2,0],[1,1]]);
});
test('quarter rotation preserves distances and four rotations return the original shape',()=>{
  let shape=original;for(let i=0;i<4;i++)shape=transform(shape,'rotate');assert.deepEqual(shape,original);
  const rotated=transform(original,'rotate');assert.equal(Math.hypot(rotated[0][0]-rotated[1][0],rotated[0][1]-rotated[1][1]),1);
});
test('completion needs tested solutions for both targets and rejects malformed drafts',()=>{
  let s=createTransform();s.sequences.first=['move','rotate'];s.sequences.second=['rotate','move'];s.tested.first=true;
  assert.equal(transformComplete(s),false);s.tested.second=true;s=restoreTransform(s);assert.equal(transformComplete(s),true);
  assert.equal(matches(['rotate','move'],'first'),false);
  assert.throws(()=>restoreTransform({...s,sequences:{...s.sequences,first:['bad','move']}}),RangeError);
  assert.throws(()=>restoreTransform({...s,tested:{first:1,second:true}}),RangeError);
});
