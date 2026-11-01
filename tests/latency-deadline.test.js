import test from 'node:test';
import assert from 'node:assert/strict';
import {latencySamples,latencyScenarios,latencySummary,latencyCreate,latencyObserve,latencyComplete,latencyRestore} from '../src/latency-deadline.js';

test('sample mean and deadline misses are distinct, including deadline equality',()=>{
 assert.deepEqual(latencySummary('quick',4),{times:[1,1,1,5],average:2,missed:1});assert.deepEqual(latencySummary('steady',4),{times:[3,3,3,3],average:3,missed:0});assert.equal(latencySummary('quick',0).average,null);assert.throws(()=>latencySummary('quick',5));
});
test('all observations, checked classifications and limits of finite samples are required',()=>{
 const s=latencyCreate();for(const m of Object.keys(latencySamples)){s.mode=m;for(let i=0;i<4;i++)assert.ok(latencyObserve(s));assert.equal(latencyObserve(s),false);}for(const [k,v] of Object.entries(latencyScenarios)){s.classifications[k]=v.expected;s.classificationChecked[k]=true;}s.fastest='quick';s.allWithin='steady';s.guarantee='steady';s.checked=true;assert.equal(latencyComplete(s),false);s.guarantee='neither';assert.ok(latencyComplete(s));const restored=latencyRestore(s);restored.counts.quick=0;assert.equal(s.counts.quick,4);assert.throws(()=>latencyRestore({...s,counts:{...s.counts,quick:5}}));
});
