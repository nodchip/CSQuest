import test from 'node:test';
import assert from 'node:assert/strict';
import {domainLogicCases,domainLogicValue,domainLogicCreate,domainLogicTrialDone,domainLogicComplete,domainLogicRestore} from '../src/logic-domains.js';

test('named propositions and the universal statement agree or differ as the domain changes',()=>{
 for(const size of [2,3])for(let mask=0;mask<1<<size;mask++){
  const lamps=Array.from({length:size},(_,i)=>!!(mask&(1<<i))),actual=domainLogicValue(size,mask);
  assert.equal(actual.named,lamps[0]&&lamps[1]);assert.equal(actual.all,lamps.every(Boolean));
 }
 assert.deepEqual(domainLogicValue(2,3),{named:true,all:true});assert.deepEqual(domainLogicValue(3,3),{named:true,all:false});
 assert.throws(()=>domainLogicValue(2,4));assert.throws(()=>domainLogicValue(0,0));
});
test('each target, accurate predictions, check and reflection are required and copied',()=>{
 const q=domainLogicCreate();for(const [id,c] of Object.entries(domainLogicCases)){const v=domainLogicValue(c.size,c.mask);q.trials[id]={mask:c.mask,...v,checked:true};assert.equal(domainLogicTrialDone(id,q.trials[id]),true);}
 assert.equal(domainLogicComplete(q),false);q.reflection='finite';assert.equal(domainLogicComplete(q),true);const copy=domainLogicRestore(q);copy.trials.counter.all=true;assert.equal(domainLogicComplete(copy),false);assert.equal(domainLogicComplete(q),true);
 assert.throws(()=>domainLogicRestore({...q,trials:{...q.trials,pair:{...q.trials.pair,mask:7}}}));
});
