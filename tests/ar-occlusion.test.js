import {test} from 'node:test';
import assert from 'node:assert/strict';
import {occlusionCases,occlusionExpected,occlusionCorrect,createOcclusion,occlusionComplete,restoreOcclusion} from '../src/ar-occlusion.js';

test('physical ordering and displayed occlusion are independent when sensing or rendering differs',()=>{
 const expected={front:{physical:'front',display:'visible'},behind:{physical:'behind',display:'hidden'},disabled:{physical:'behind',display:'visible'},inaccurate:{physical:'behind',display:'visible'}};
 for(const id of Object.keys(occlusionCases)){assert.deepEqual(occlusionExpected(id),expected[id]);for(const physical of ['front','behind'])for(const display of ['visible','hidden'])assert.equal(occlusionCorrect(id,{physical,display}),physical===expected[id].physical&&display===expected[id].display);}
});
test('checked observations are required and saved choices are validated and copied',()=>{
 const s=createOcclusion();for(const id of Object.keys(occlusionCases))s.trials[id]={...occlusionExpected(id),checked:true};const copy=restoreOcclusion(s);assert.equal(occlusionComplete(copy),true);s.trials.inaccurate.display='hidden';assert.equal(occlusionComplete(copy),true);assert.throws(()=>restoreOcclusion(s),RangeError);
});
