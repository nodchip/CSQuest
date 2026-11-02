import {test} from 'node:test';
import assert from 'node:assert/strict';
import {kernelRepairCreate,kernelRepairStep,kernelRepairReplay,kernelRepairComplete,kernelRepairRestore} from '../src/os-kernel-repair.js';

test('host and guest updates require their own notice and test, and do not update each other',()=>{
 const q=kernelRepairCreate();assert.equal(kernelRepairStep(q,'applyHost').applyHost,false);assert.equal(kernelRepairStep(q,'testHost').testHost,false);kernelRepairStep(q,'notice');kernelRepairStep(q,'testHost');let s=kernelRepairStep(q,'applyHost');assert.equal(s.applyHost,true);assert.equal(s.applyGuest,false);assert.equal(kernelRepairComplete(q),false);assert.equal(kernelRepairStep(q,'applyGuest').applyGuest,false);kernelRepairStep(q,'testGuest');s=kernelRepairStep(q,'applyGuest');assert.equal(s.applyGuest,true);assert.equal(kernelRepairComplete(q),false);q.answer='review';assert.equal(kernelRepairComplete(q),true);
});
test('restoration replays actions, ignores forged flags, and rejects invalid histories',()=>{
 const q=kernelRepairCreate();for(const a of ['notice','testGuest','applyGuest'])kernelRepairStep(q,a);const copy=kernelRepairRestore({...q,applyHost:true});assert.equal(kernelRepairReplay(copy.history).applyHost,false);copy.history.push('testHost');assert.equal(q.history.length,3);assert.throws(()=>kernelRepairRestore({history:['applyAll'],answer:null}));assert.throws(()=>kernelRepairRestore({history:Array(51).fill('notice'),answer:null}));
});
