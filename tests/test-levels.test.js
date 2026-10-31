import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runTestLevel,createTestLevels,testLevelsComplete,restoreTestLevels} from '../src/test-levels.js';
test('the fixed tests distinguish component, wiring and user-need gaps',()=>{
 const levels=['unit','integration','system','acceptance'];assert.deepEqual(levels.map(level=>runTestLevel('logic',level).pass),[false,false,false,false]);assert.deepEqual(levels.map(level=>runTestLevel('wiring',level).pass),[true,false,false,false]);assert.deepEqual(levels.map(level=>runTestLevel('need',level).pass),[true,true,true,false]);assert.deepEqual(runTestLevel('need','system'),{actual:3,expected:3,pass:true});assert.deepEqual(runTestLevel('need','acceptance'),{actual:3,expected:2,pass:false});assert.throws(()=>runTestLevel('bad','unit'),RangeError);
});
test('all scenario-level trials are needed and drafts are independent and validated',()=>{
 const s=createTestLevels();for(const t of Object.values(s.tested))for(const key of Object.keys(t))t[key]=true;const copy=restoreTestLevels(s);s.tested.need.acceptance=false;assert.equal(testLevelsComplete(copy),true);assert.equal(testLevelsComplete(s),false);assert.throws(()=>restoreTestLevels({...copy,selected:'bad'}),RangeError);
});
