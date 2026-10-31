import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nextVersion,versionTrialCorrect,createVersion,versionComplete,restoreVersion} from '../src/version-choice.js';
test('stable 1.2.3 increments reset lower components and each scenario requires the smallest permitted change',()=>{
 assert.deepEqual(['patch','minor','major'].map(nextVersion),['1.2.4','1.3.0','2.0.0']);const expected={fix:'patch',add:'minor',remove:'major'};for(const [id,answer] of Object.entries(expected))for(const choice of ['patch','minor','major'])assert.equal(versionTrialCorrect({choice,checked:true},id),choice===answer);assert.throws(()=>nextVersion('bad'),RangeError);
});
test('each scenario requires a checked selection and saved choices are independent',()=>{
 const s=createVersion();s.fix={choice:'patch',checked:true};s.add={choice:'minor',checked:true};s.remove={choice:'major',checked:true};const copy=restoreVersion(s);s.fix.checked=false;assert.equal(versionComplete(copy),true);assert.equal(versionComplete(s),false);assert.throws(()=>restoreVersion({...copy,remove:{choice:'wrong',checked:true}}),RangeError);
});
