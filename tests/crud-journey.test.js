import test from 'node:test';
import assert from 'node:assert/strict';
import {crudTasks,replayCrud} from '../src/crud-journey.js';

test('a record is created, read, updated, deleted and confirmed absent',()=>{
  const actions=['create','read','update','delete','read'];
  const expected=[null,1,1,3,null,null];
  for(let i=0;i<=actions.length;i++){
    const state=replayCrud(actions.slice(0,i));
    assert.equal(state.value,expected[i]);assert.equal(state.complete,i===actions.length);
    assert.equal(state.trace.length,i);
  }
  assert.match(replayCrud(actions).trace[4].result,/０個.*異なり/);
  for(let i=0;i<actions.length;i++)for(const wrong of ['create','read','update','delete'].filter(x=>x!==actions[i]))assert.throws(()=>replayCrud([...actions.slice(0,i),wrong]));
  assert.throws(()=>replayCrud([...actions,'read']));assert.equal(crudTasks.length,5);
});
