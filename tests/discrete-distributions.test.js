import {test} from 'node:test';
import assert from 'node:assert/strict';
import {discreteCases,discreteMass,discreteSample,discreteTrialCorrect,createDiscreteDistributions,discreteDistributionsComplete,restoreDiscreteDistributions} from '../src/discrete-distributions.js';

test('４分布の確率、裾、支持と期待値を検証する',()=>{
 for(const id of Object.keys(discreteCases)){const d=discreteMass(id);assert.ok(Math.abs(d.values.reduce((a,b)=>a+b,0)+d.tail-1)<1e-12);}
 assert.deepEqual(discreteMass('single').values.slice(0,3),[0.5,0.5,0]);assert.deepEqual(discreteMass('batch').values.slice(0,5),[1/16,4/16,6/16,4/16,1/16]);
 assert.deepEqual(discreteMass('wait').values.slice(0,4),[0,0.5,0.25,0.125]);assert.equal(discreteMass('wait').tail,1/64);
 const p=discreteMass('arrivals');assert.ok(Math.abs(p.values[0]-Math.exp(-2))<1e-15);assert.ok(Math.abs(p.values[2]-2*Math.exp(-2))<1e-15);
 let geometricMean=0,poissonMean=0,poissonP=Math.exp(-2);for(let k=1;k<=100;k++){geometricMean+=k*2**(-k);poissonP*=2/k;poissonMean+=k*poissonP;}assert.ok(Math.abs(geometricMean-2)<1e-12);assert.ok(Math.abs(poissonMean-2)<1e-12);
});
test('乱数から各試行を生成し、幾何分布の打切りを区別する',()=>{
 const bytes=new Uint8Array(64);assert.equal(discreteSample('single',bytes),0);bytes[0]=1;assert.equal(discreteSample('single',bytes),1);bytes[1]=1;assert.equal(discreteSample('batch',bytes),2);assert.equal(discreteSample('wait',bytes),1);
 bytes.fill(0);assert.equal(discreteSample('wait',bytes),65);bytes[63]=1;assert.equal(discreteSample('wait',bytes),64);bytes.fill(0);assert.equal(discreteSample('arrivals',bytes),0);bytes[0]=128;assert.equal(discreteSample('arrivals',bytes),2);
 assert.throws(()=>discreteSample('wait',new Uint8Array(4)),RangeError);
});
test('ベルヌーイと１回の二項分布の両方を認め、各試行と振り返りを検証する',()=>{
 const s=createDiscreteDistributions();for(const [id,c] of Object.entries(discreteCases))s.trials[id]={samples:[id==='wait'?1:0],answer:c.answers[0],checked:true};s.trials.single.answer='binomial';assert.equal(discreteTrialCorrect('single',s.trials.single),true);s.compare='different';s.convention='include';assert.equal(discreteDistributionsComplete(s),false);s.checked=true;assert.equal(discreteDistributionsComplete(s),true);
 const r=restoreDiscreteDistributions(s);r.trials.wait.samples.push(2);assert.equal(s.trials.wait.samples.length,1);
 for(const p of [{selected:'bad'},{compare:'bad'},{checked:1},{trials:{...s.trials,wait:{samples:[0],answer:null,checked:false}}},{trials:{...s.trials,single:{samples:[2],answer:null,checked:false}}}])assert.throws(()=>restoreDiscreteDistributions({...s,...p}),RangeError);
});
