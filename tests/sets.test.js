import test from 'node:test';
import assert from 'node:assert/strict';
import {setMembers,checkSet,createSets,restoreSets,setsComplete} from '../src/sets.js';

test('each operation selects the intended members, including the universe outside both sets',()=>{
  assert.deepEqual(setMembers('union'),['A','B','C','D','E','F']);
  assert.deepEqual(setMembers('intersection'),['A','C']);
  assert.deepEqual(setMembers('difference'),['B','D']);
  assert.deepEqual(setMembers('complement'),['B','D','G']);
});
test('all subsets require exactly the right membership and union count',()=>{
  for(const [id,expected] of Object.entries({union:'ABCDEF',intersection:'AC',difference:'BD',complement:'BDG'}))for(let mask=0;mask<128;mask++){
    const members=[...'ABCDEFG'].filter((_,i)=>mask&(1<<i));const result=checkSet(id,{members,count:6});
    assert.equal(result.members,members.join('')===expected);assert.equal(result.count,true);
  }
  assert.equal(checkSet('union',{members:[...'ABCDEF'],count:8}).count,false);
});
test('each checked answer restores independently and malformed members are rejected',()=>{
  const state=createSets();for(const id of Object.keys(state.choices))state.choices[id]={members:setMembers(id),count:id==='union'?6:null,tested:true};
  assert.equal(setsComplete(state),true);const restored=restoreSets(state);state.choices.union.members.pop();assert.equal(restored.choices.union.members.length,6);
  restored.choices.union.members.push('A');assert.throws(()=>restoreSets(restored),RangeError);
});
