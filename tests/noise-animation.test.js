import {test} from 'node:test';
import assert from 'node:assert/strict';
import {noiseModes,noiseTimes,noiseSample,noiseCreate,noiseCheck,noiseComplete,noiseRestore} from '../src/noise-animation.js';

test('fixed samples, held values and two interpolation curves match independent quarter-step values',()=>{
 const expected={hold:[0,0,0,0,4,4,4,4,0],linear:[0,1,2,3,4,3,2,1,0],smooth:[0,.625,2,3.375,4,3.375,2,.625,0]};
 for(const mode of Object.keys(noiseModes))assert.deepEqual(Array.from({length:9},(_,i)=>noiseSample(mode,i)),expected[mode]);assert.throws(()=>noiseSample('linear',9));
});
test('all nine comparisons and both reflections are required; saved checks cannot be forged',()=>{
 let q=noiseCreate();for(const m of Object.keys(noiseModes))for(const id of Object.keys(noiseTimes)){q.mode=m;q.time=id;const t=q.trials[`${m}:${id}`],correct=noiseSample(m,noiseTimes[id].tick);t.guess=correct===0?4:0;assert.equal(noiseCheck(q),false);t.guess=correct;assert.equal(noiseCheck(q),true);q=noiseRestore(q);}assert.equal(noiseComplete(q),false);q.shape='smooth';q.repeat='same';assert.equal(noiseComplete(q),true);const copy=noiseRestore(q);copy.trials['hold:at'].guess=0;assert.equal(noiseComplete(q),true);assert.equal(noiseComplete(copy),false);assert.throws(()=>noiseRestore(copy));
});
