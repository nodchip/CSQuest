import test from 'node:test';
import assert from 'node:assert/strict';
import {timingModes,timingChannels,timingRun,timingCompare,timingAudit,timingCreate,timingCheck,timingComplete,timingRestore} from '../src/timing-flow.js';

test('same public result can have secret-dependent time; all eight ordered comparisons are counted',()=>{
 for(const pub of [0,1]){assert.deepEqual(timingCompare('variable','value',pub),[pub,pub]);assert.deepEqual(timingCompare('variable','time',pub),[1,3]);assert.deepEqual(timingCompare('fixed','value',pub),[pub,pub]);assert.deepEqual(timingCompare('fixed','time',pub),[3,3]);}
 assert.deepEqual(timingAudit('variable','time'),{comparisons:8,differences:4});for(const [mode,channel] of [['variable','value'],['fixed','value'],['fixed','time']])assert.deepEqual(timingAudit(mode,channel),{comparisons:8,differences:0});assert.throws(()=>timingRun('variable',2,0),RangeError);assert.throws(()=>timingAudit('fixed','unknown'),RangeError);
});
test('four predictions, four audits and reflection required; restoration validates results',()=>{
 const q=timingCreate();q.answer='different';timingCheck(q);assert.equal(q.last.correct,false);assert.equal(q.seen.length,0);
 for(const mode of Object.keys(timingModes))for(const channel of Object.keys(timingChannels)){q.mode=mode;q.channel=channel;q.pub=1;const [a,b]=timingCompare(mode,channel,1);q.answer=a===b?'same':'different';timingCheck(q);q.audited.push(`${mode}:${channel}`);}
 assert.equal(timingComplete(q),false);q.reflection='observable';assert.equal(timingComplete(q),true);const copy=timingRestore(q);copy.seen.pop();assert.equal(q.seen.length,4);assert.throws(()=>timingRestore({...q,last:{...q.last,correct:false}}),RangeError);assert.throws(()=>timingRestore({...q,audited:['fixed:time','fixed:time']}),RangeError);
});
