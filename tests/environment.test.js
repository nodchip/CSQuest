import test from 'node:test';
import assert from 'node:assert/strict';
import {createEnvironment,createEnvironmentTrial,stepEnvironment,environmentCorrect,environmentComplete,restoreEnvironment} from '../src/environment.js';

test('export copies the value at child startup and later changes are separate',()=>{
  const all=createEnvironment();
  for(const [id,actions] of Object.entries({local:['blue','spawn'],exported:['blue','export','spawn'],copies:['blue','export','spawn','red','green'],temporary:['blue','export','spawnTemp','spawnAgain']})){
    let s=createEnvironmentTrial(id);for(const action of actions)s=stepEnvironment(s,action);s.checked=true;assert.ok(environmentCorrect(s));all.trials[id]=s;
  }
  assert.equal(all.trials.local.child.value,null);assert.equal(all.trials.copies.atSpawn,'blue');assert.equal(all.trials.copies.parent,'red');assert.equal(all.trials.copies.child.value,'green');assert.equal(all.trials.temporary.parent,'blue');assert.equal(all.trials.temporary.child.value,'red');assert.equal(all.trials.temporary.second.value,'blue');assert.ok(environmentComplete(all));assert.deepEqual(restoreEnvironment(all),all);
});
test('temporary assignment affects only the first child and old drafts gain the new case',()=>{
  let s=createEnvironmentTrial('temporary');assert.equal(stepEnvironment(s,'spawnAgain').history.length,0);
  for(const action of ['blue','export','spawnTemp','spawnAgain'])s=stepEnvironment(s,action);
  assert.equal(s.parent,'blue');assert.equal(s.child.value,'red');assert.equal(s.second.value,'blue');assert.equal(stepEnvironment(s,'spawnAgain').history.length,s.history.length);
  const trials={local:{history:['blue','spawn'],checked:true},exported:{history:[],checked:false},copies:{history:[],checked:false}};
  const restored=restoreEnvironment({selected:'local',trials});assert.equal(restored.trials.temporary.child,null);assert.equal(environmentComplete(restored),false);
  assert.throws(()=>restoreEnvironment({selected:'temporary',trials:{...trials,temporary:{history:['spawnAgain'],checked:false}}}));
});
test('a child does not receive an unexported value and invalid saved steps are rejected',()=>{
  let s=createEnvironmentTrial('exported');s=stepEnvironment(s,'blue');s=stepEnvironment(s,'spawn');s=stepEnvironment(s,'export');s.checked=true;assert.equal(environmentCorrect(s),false);
  const trials={local:{history:['blue','spawn'],checked:true},exported:{history:[],checked:false},copies:{history:['blue','export','spawn','red'],checked:false}};
  assert.equal(restoreEnvironment({selected:'copies',trials}).trials.copies.child.value,'blue');
  assert.throws(()=>restoreEnvironment({selected:'local',trials:{...trials,local:{history:['green'],checked:false}}}));
});
