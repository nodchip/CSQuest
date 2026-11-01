import test from 'node:test';
import assert from 'node:assert/strict';
import {listState,createPersistentList,persistentListComplete,restorePersistentList} from '../src/persistent-list.js';
const values=list=>list.map(n=>n.value),ids=list=>list.map(n=>n.id);
test('sharing and path copying preserve old versions while mutation changes aliases',()=>{
 for(const mode of ['mutable','persistent']){
  const start=listState(mode,0),prefixed=listState(mode,1),changed=listState(mode,2);
  assert.deepEqual(values(start.lists.old),[1,2,3]);assert.deepEqual(values(prefixed.lists.front),[0,1,2,3]);assert.deepEqual(ids(prefixed.lists.front).slice(1),ids(prefixed.lists.old));
  assert.deepEqual(values(changed.lists.changed),[1,9,3]);
  if(mode==='persistent'){
   assert.deepEqual(values(changed.lists.old),[1,2,3]);assert.deepEqual(values(changed.lists.front),[0,1,2,3]);assert.deepEqual(ids(changed.lists.changed),['P','D','C']);assert.equal(changed.newForChange,2);
  }else{
   assert.deepEqual(values(changed.lists.old),[1,9,3]);assert.deepEqual(values(changed.lists.front),[0,1,9,3]);assert.equal(changed.newForChange,0);
  }
 }
});
test('both verified trials and reflection are required, and invalid resumes are rejected',()=>{
 let s=createPersistentList();assert.equal(persistentListComplete(s),false);
 s.trials.persistent={stage:2,guess:2,verified:true};s.trials.mutable={stage:2,guess:0,verified:true};s.answer='share';s.checked=true;
 assert.equal(persistentListComplete(restorePersistentList(s)),true);assert.throws(()=>restorePersistentList({...s,trials:{...s.trials,mutable:{stage:1,guess:0,verified:true}}}));
 assert.throws(()=>restorePersistentList({...s,trials:{...s.trials,persistent:{stage:2,guess:1,verified:true}}}));
});
