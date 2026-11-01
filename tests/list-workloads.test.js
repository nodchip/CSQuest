import test from 'node:test';
import assert from 'node:assert/strict';
import {workloadCost,createWorkloads,workloadsComplete,restoreWorkloads} from '../src/list-workloads.js';
import {createListTradeoff,restoreListTradeoff} from '../src/list-tradeoff.js';

test('different workload mixes reverse the lower-cost structure under equal step costs',()=>{
 assert.deepEqual([workloadCost('frontHeavy','array'),workloadCost('frontHeavy','linked')],[16,10]);
 assert.deepEqual([workloadCost('tailHeavy','array'),workloadCost('tailHeavy','linked')],[8,14]);
 const s=createWorkloads();s.answers={frontHeavy:'linked',tailHeavy:'linked'};s.checked={frontHeavy:true,tailHeavy:true};assert.equal(workloadsComplete(s),false);
 s.answers.tailHeavy='array';assert.equal(workloadsComplete(s),true);
 const copy=restoreWorkloads(s);copy.answers.frontHeavy='array';assert.equal(s.answers.frontHeavy,'linked');
 assert.throws(()=>restoreWorkloads({...s,answers:{...s.answers,tailHeavy:'unknown'}}));
});
test('earlier saved drafts retain their trials and acquire fresh workload comparisons',()=>{
 const {workloads,...old}=createListTradeoff();old.trials.front4.steps.array=2;
 const r=restoreListTradeoff(old);assert.equal(r.trials.front4.steps.array,2);assert.deepEqual(r.workloads,createWorkloads());
});
