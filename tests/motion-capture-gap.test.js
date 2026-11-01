import test from 'node:test';
import assert from 'node:assert/strict';
import {captureCases,captureObserved,captureEstimate,captureResult,createMotionCaptureGap,motionCaptureGapComplete,restoreMotionCaptureGap} from '../src/motion-capture-gap.js';
test('identical observed samples yield the same interpolation despite different hidden positions',()=>{
 assert.deepEqual(captureObserved,[0,1,null,1,0]);assert.equal(captureEstimate(),1);assert.deepEqual(captureResult('high'),{estimate:1,truth:2,absoluteError:1});assert.deepEqual(captureResult('low'),{estimate:1,truth:0,absoluteError:1});assert.throws(()=>captureResult('other'));
});
test('only completed estimates can reveal each example and finish the quest',()=>{
 const s=createMotionCaptureGap();for(const id of Object.keys(captureCases))s.trials[id]={scanned:5,guess:1,filled:true,revealed:true};s.permission='ask';s.answer='uncertain';s.checked=true;assert.ok(motionCaptureGapComplete(s));assert.deepEqual(restoreMotionCaptureGap(s),s);s.trials.high.guess=2;assert.throws(()=>restoreMotionCaptureGap(s));
});
