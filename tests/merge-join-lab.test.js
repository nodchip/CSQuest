import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeLeft,mergeRight,createMergeJoinLab,mergeJoinDone,mergeJoinLabAct,restoreMergeJoinLab} from '../src/merge-join-lab.js';

test('sorted merging produces every duplicate-key pair and omits unmatched rows',()=>{
  let s=createMergeJoinLab();const expected=mergeLeft.flatMap(a=>mergeRight.filter(b=>a.key===b.key).map(b=>`${a.id}・${b.id}`));
  for(const action of ['match','right','left','match']){const r=mergeJoinLabAct(s,action);assert.equal(r.ok,true);s=r.state;}
  assert.equal(mergeJoinDone(s),true);assert.deepEqual(s.output,expected);assert.equal(s.output.length,5);assert.deepEqual(restoreMergeJoinLab(s),s);
  assert.equal(mergeJoinLabAct(s,'right').ok,false);
});
test('incorrect steps leave cursors unchanged and saved history is replayed',()=>{
  let s=createMergeJoinLab();assert.equal(mergeJoinLabAct(s,'left').ok,false);assert.deepEqual(s,createMergeJoinLab());s=mergeJoinLabAct(s,'match').state;
  assert.deepEqual(restoreMergeJoinLab({history:s.history}),s);assert.equal(mergeJoinLabAct(s,'left').ok,false);assert.throws(()=>restoreMergeJoinLab({history:['left']}));assert.throws(()=>restoreMergeJoinLab({history:['match','match']}));
});
