import test from 'node:test';
import assert from 'node:assert/strict';
import {waveCases,waveWidths,waveDensity,waveCreate,waveCheck,waveDone,waveRestore} from '../src/wave-packet.js';
test('Gaussian densities integrate to one and their numerically computed variances match the widths',()=>{
 for(const id of Object.keys(waveCases))for(const sigma of Object.values(waveWidths(id))){
  const step=sigma/100;let sum=0,second=0;
  for(let i=-1000;i<1000;i++){const x=(i+0.5)*step,p=waveDensity(x,sigma)*step;sum+=p;second+=x*x*p;}
  assert.ok(Math.abs(sum-1)<1e-10);assert.ok(Math.abs(second-sigma*sigma)<1e-9);
 }
 for(const id of Object.keys(waveCases)){const {x,p}=waveWidths(id);assert.equal(x*p,.5);}
 assert.throws(()=>waveDensity(0,0),RangeError);
});
test('wrong predictions do not count; all three cases and a reflection are needed',()=>{
 const q=waveCreate();q.answer='wider';assert.equal(waveCheck(q),false);assert.deepEqual(q.seen,[]);
 for(const [id,answer] of [['narrow','wider'],['baseline','same'],['wide','narrower']]){q.selected=id;q.answer=answer;assert.equal(waveCheck(q),true);}
 assert.equal(waveDone(q),false);q.reflection='ensemble';assert.equal(waveDone(waveRestore(q)),true);
 const copy=waveRestore(q);copy.seen.pop();assert.equal(q.seen.length,3);assert.throws(()=>waveRestore({...q,seen:['wide','wide']}),RangeError);
});
