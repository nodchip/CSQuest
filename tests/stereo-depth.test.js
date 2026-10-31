import {test} from 'node:test';
import assert from 'node:assert/strict';
import {stereoCases,stereoPositions,stereoDisparities,stereoExpected,stereoCorrect,createStereo,stereoComplete,restoreStereo} from '../src/stereo-depth.js';

test('parallel projections have the expected disparity for depth and baseline',()=>{
 const expected={near:{left:1,right:-1,disparity:2},far:{left:.5,right:-.5,disparity:1},same:{left:0,right:0,disparity:0}};
 for(const id of Object.keys(stereoCases)){assert.deepEqual(stereoExpected(id),expected[id]);for(const left of stereoPositions)for(const right of stereoPositions)for(const disparity of stereoDisparities)assert.equal(stereoCorrect(id,{left,right,disparity}),left===expected[id].left&&right===expected[id].right&&disparity===expected[id].disparity);}
});
test('all checked projections must be correct and saved records are copied',()=>{
 const s=createStereo();for(const id of Object.keys(stereoCases))s.trials[id]={...stereoExpected(id),checked:true};const copy=restoreStereo(s);assert.equal(stereoComplete(copy),true);s.trials.near.right=0;assert.equal(stereoComplete(copy),true);assert.throws(()=>restoreStereo(s),RangeError);
});
