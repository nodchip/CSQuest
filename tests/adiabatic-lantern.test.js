import test from 'node:test';
import assert from 'node:assert/strict';
import {adiabaticGround,adiabaticStages,adiabaticCreate,adiabaticCheck,adiabaticDone,adiabaticRestore} from '../src/adiabatic-lantern.js';
test('two by two Hamiltonian eigenvalues, gap and ground-state probabilities are consistent',()=>{
 for(const s of adiabaticStages){
  const a=adiabaticGround('zero',s),b=adiabaticGround('one',s);
  assert.ok(Math.abs(a.ground*a.ground-((1-s)**2+s*s))<1e-12);
  assert.ok(Math.abs(a.gap-(a.excited-a.ground))<1e-12);
  assert.ok(Math.abs(a.p0+b.p0-1)<1e-12);
  assert.ok(a.p0>=0&&a.p0<=1);
 }
 assert.equal(adiabaticGround('zero',0).p0,.5);assert.equal(adiabaticGround('zero',1).p0,1);
 assert.equal(adiabaticGround('one',1).p0,0);
 assert.ok(adiabaticStages.every(s=>adiabaticGround('zero',.5).gap<=adiabaticGround('zero',s).gap));
 assert.throws(()=>adiabaticGround('zero',.3),RangeError);
});
test('all ten correct predictions, minimum gap and reflection are required',()=>{
 const q=adiabaticCreate();q.answer='one';assert.equal(adiabaticCheck(q).correct,false);
 for(const t of ['zero','one'])for(const s of adiabaticStages){q.target=t;q.stage=s;q.answer=s===0?'equal':t;assert.equal(adiabaticCheck(q).correct,true);}
 q.gap='middle';assert.equal(adiabaticDone(q),false);q.reflection='continuous';assert.equal(adiabaticDone(adiabaticRestore(q)),true);
 const copy=adiabaticRestore(q);copy.seen.pop();assert.equal(q.seen.length,10);assert.throws(()=>adiabaticRestore({...q,seen:['zero:0','zero:0']}),RangeError);
});
