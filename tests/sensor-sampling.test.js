import {test} from 'node:test';
import assert from 'node:assert/strict';
import {samplingCases,samplingTimes,createSamplingTrial,samplingStep,createSampling,samplingComplete,restoreSampling} from '../src/sensor-sampling.js';

test('a short pulse and no pulse give identical slow samples while faster sampling finds it',()=>{
 const recorded={};for(const id of Object.keys(samplingCases)){let s=createSamplingTrial(id);for(const time of samplingTimes(id))s=samplingStep(s,time);recorded[id]=s.samples.map(x=>x.value);}
 assert.deepEqual(recorded.shortSlow,[0,0,0]);assert.deepEqual(recorded.noneSlow,[0,0,0]);assert.deepEqual(recorded.shortFast,[0,1,0,0,0]);assert.deepEqual(recorded.longSlow,[0,1,0]);
});
test('sampling times and observations are validated and histories replay',()=>{
 const all=createSampling();for(const id of Object.keys(samplingCases)){let s=all.trials[id];assert.equal(samplingStep(s,1).history.length,0);for(const time of samplingTimes(id))s=samplingStep(s,time);const observed=s.samples.some(x=>x.value===1);assert.equal(samplingStep(s,!observed).done,false);all.trials[id]=samplingStep(s,observed);}assert.equal(samplingComplete(all),true);
 const saved={selected:'shortSlow',histories:Object.fromEntries(Object.entries(all.trials).map(([id,s])=>[id,s.history]))};assert.equal(samplingComplete(restoreSampling(saved)),true);saved.histories.shortSlow=[0,1];assert.throws(()=>restoreSampling(saved),RangeError);
});
