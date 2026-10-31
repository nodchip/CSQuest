import test from 'node:test';
import assert from 'node:assert/strict';
import {scalingCases,workerCounts,timeOptions,scalingTime,createScaling,restoreScaling,scalingComplete} from '../src/scaling.js';
test('fixed-size work includes an unchanged sequential portion and evenly split work',()=>{
  assert.deepEqual(workerCounts.map(n=>scalingTime('quick',n)),[12,8,6,5]);assert.deepEqual(workerCounts.map(n=>scalingTime('long',n)),[16,12,10,9]);
  for(const [id,task] of Object.entries(scalingCases))for(const n of workerCounts){assert.equal((scalingTime(id,n)-task.serial)*n,task.parallel);assert.ok(scalingTime(id,n)>task.serial);}
});
test('all eight predictions must be checked and correct',()=>{
  const state=createScaling();for(const id of Object.keys(scalingCases))for(const n of workerCounts)state.trials[id][n]={prediction:scalingTime(id,n),tested:true};assert.equal(scalingComplete(restoreScaling(state)),true);
  for(const id of Object.keys(scalingCases))for(const n of workerCounts)for(const wrong of timeOptions.filter(x=>x!==scalingTime(id,n))){const other=structuredClone(state);other.trials[id][n].prediction=wrong;assert.equal(scalingComplete(other),false);}
});
test('invalid worker counts and draft predictions are rejected',()=>{
  const state=createScaling();assert.throws(()=>scalingTime('quick',3),RangeError);state.trials.quick[1].prediction=7;assert.throws(()=>restoreScaling(state),RangeError);
});
