import {test} from 'node:test';
import assert from 'node:assert/strict';
import {motionCompare,motionBest,createMotion,motionComplete,restoreMotion} from '../src/block-motion.js';
test('absolute differences identify a unique match and two equally good matches',()=>{
 assert.deepEqual(['left','stay','right'].map(k=>motionCompare('unique',k).score),[4,5,0]);assert.deepEqual(['left','stay','right'].map(k=>motionCompare('repeating',k).score),[0,3,0]);assert.deepEqual(motionBest('unique'),['right']);assert.deepEqual(motionBest('repeating'),['left','right']);assert.throws(()=>motionCompare('unique','bad'),RangeError);
});
test('completion requires all comparisons, all tied minima and an independent validated draft',()=>{
 const s=createMotion();for(const t of Object.values(s.trials))for(const k of ['left','stay','right'])t.tested[k]=true;s.trials.unique.marks=['right'];s.trials.repeating.marks=['left','right'];s.trials.unique.checked=s.trials.repeating.checked=true;const copy=restoreMotion(s);s.trials.repeating.marks.pop();assert.equal(motionComplete(copy),true);assert.equal(motionComplete(s),false);assert.throws(()=>restoreMotion({...s,trials:{...s.trials,unique:{...s.trials.unique,marks:['right','right']}}}),RangeError);
});
