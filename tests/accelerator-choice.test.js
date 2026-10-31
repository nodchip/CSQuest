import test from 'node:test';
import assert from 'node:assert/strict';
import {createAcceleratorTrial,stepAccelerator,createAccelerators,acceleratorCorrect,acceleratorComplete,restoreAccelerators} from '../src/accelerator-choice.js';

test('fixed overhead changes which device is faster as the batch grows',()=>{
  const all=createAccelerators();for(const [job,cpu,accelerator] of [['small',6,8],['large',24,17]]){for(const device of ['cpu','accelerator']){let s=createAcceleratorTrial(job,device);while(s.phase!=='done')s=stepAccelerator(s);assert.equal(s.time,device==='cpu'?cpu:accelerator);all.trials[job][device]=s;}all.answers[job]=cpu<accelerator?'cpu':'accelerator';all.checked[job]=true;assert.ok(acceleratorCorrect(all,job));}assert.ok(acceleratorComplete(all));
});
test('a partially completed run restores and cannot be replayed past completion',()=>{
  const saved={selected:'large',device:'accelerator',steps:{small:{cpu:0,accelerator:0},large:{cpu:0,accelerator:3}},answers:{small:'',large:''},checked:{small:false,large:false}};const s=restoreAccelerators(saved).trials.large.accelerator;assert.equal(s.processed,3);assert.equal(s.time,8);
  assert.throws(()=>restoreAccelerators({...saved,steps:{...saved.steps,small:{cpu:2,accelerator:0}}}));
});
