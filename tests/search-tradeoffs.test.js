import test from 'node:test';
import assert from 'node:assert/strict';
import {tradeoffCases,tradeoffPlans,tradeoffResult,tradeoffBest,tradeoffCreate,tradeoffComplete,tradeoffRestore} from '../src/search-tradeoffs.js';

test('preparation, actual fixed search counts, and limits determine the four choices',()=>{
 assert.deepEqual(tradeoffResult('single','scan'),{counts:[1],cost:1,feasible:true});
 assert.deepEqual(tradeoffResult('repeated','scan'),{counts:[8,7,8,7],cost:30,feasible:true});
 assert.deepEqual(tradeoffResult('repeated','sorted'),{counts:[3,3,3,3],cost:20,feasible:true});
 assert.deepEqual(tradeoffResult('repeated','hash'),{counts:[1,1,1,1],cost:12,feasible:true});
 assert.equal(tradeoffResult('limited','hash').feasible,false);assert.equal(tradeoffResult('deadline','hash').feasible,false);
 assert.deepEqual(Object.keys(tradeoffCases).map(tradeoffBest),[['scan'],['sorted'],['sorted'],['hash']]);
});
test('every comparison, correct decision and reflection are required and drafts are copied',()=>{
 const q=tradeoffCreate();for(const id of Object.keys(tradeoffCases)){q.trials[id]={seen:Object.keys(tradeoffPlans),answer:tradeoffBest(id)[0],checked:true};}
 assert.equal(tradeoffComplete(q),false);q.reflection='constraints';assert.equal(tradeoffComplete(q),true);const copy=tradeoffRestore(q);copy.trials.single.seen.pop();assert.equal(tradeoffComplete(copy),false);assert.equal(tradeoffComplete(q),true);
 assert.throws(()=>tradeoffRestore({...q,trials:{...q.trials,single:{seen:['scan','scan'],answer:'scan',checked:true}}}));
});
