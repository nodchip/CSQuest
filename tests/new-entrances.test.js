import test from 'node:test';
import assert from 'node:assert/strict';
import {newEntrances,newEntranceIds,checkNewEntrance,validNewEntranceDrafts} from '../src/new-entrances.js';

test('new requests offer independent situations and validate saved progress',()=>{
 for(const id of newEntranceIds){
  const q=newEntrances[id];
  assert.equal(q.scenarios.length,2);
  assert.ok(q.intro&&q.goal&&q.lesson);
  for(const [i,s] of q.scenarios.entries()){
   assert.ok(s.prompt&&s.hint&&s.choices.length>=2);
   assert.equal(checkNewEntrance(id,i,s.answer),true);
   assert.equal(checkNewEntrance(id,i,[]),false);
   assert.equal(checkNewEntrance(id,i,[...s.answer,...s.answer]),false);
  }
  assert.equal(validNewEntranceDrafts({[id]:[q.scenarios[0].answer]},{[id]:[0]}),true);
  assert.equal(validNewEntranceDrafts({[id]:[[]]},{}),false);
 }
 assert.equal(validNewEntranceDrafts({unknown:[]},{}),false);
 assert.equal(validNewEntranceDrafts({}, {unknown:[]}),false);
});
test('shared cart must be returned before the other worker can use it',()=>{
 const q=newEntrances['harbor-parallel'];
 for(const [i,scene] of q.scenarios.entries()){
  assert.equal(checkNewEntrance('harbor-parallel',i,scene.answer),true);
  assert.equal(checkNewEntrance('harbor-parallel',i,[...scene.answer].reverse()),false);
 }
});
