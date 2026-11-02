import test from 'node:test';
import assert from 'node:assert/strict';
import {tradeoffCases,tradeoffPlans,tradeoffTrace,tradeoffResult,tradeoffBest,tradeoffCreate,tradeoffComplete,tradeoffRestore} from '../src/search-tradeoffs.js';

test('preparation, actual fixed search counts, and limits determine the four choices',()=>{
 assert.deepEqual(tradeoffResult('single','scan'),{counts:[1],cost:1,feasible:true});
 assert.deepEqual(tradeoffResult('repeated','scan'),{counts:[8,7,8,7],cost:30,feasible:true});
 assert.deepEqual(tradeoffResult('repeated','sorted'),{counts:[3,3,3,3],cost:20,feasible:true});
 assert.deepEqual(tradeoffResult('repeated','hash'),{counts:[1,1,1,1],cost:12,feasible:true});
 assert.equal(tradeoffResult('limited','hash').feasible,false);assert.equal(tradeoffResult('deadline','hash').feasible,false);
 assert.deepEqual(Object.keys(tradeoffCases).map(tradeoffBest),[['scan'],['sorted'],['sorted'],['hash'],['scan','sorted']]);
});
test('unsuccessful searches examine the correct values and both tied methods are accepted',()=>{
 assert.deepEqual(tradeoffTrace(9,'scan'),{compared:[4,1,8,3,6,2,7,5],count:8,found:false});
 assert.deepEqual(tradeoffTrace(9,'sorted'),{compared:[4,6,7,8],count:4,found:false});
 assert.deepEqual(tradeoffTrace(9,'hash'),{compared:[],count:1,found:false});
 assert.deepEqual(tradeoffTrace(5,'sorted'),{compared:[4,6,5],count:3,found:true});
 assert.deepEqual(tradeoffResult('missing','scan'),{counts:[8,8],cost:16,feasible:true});
 assert.deepEqual(tradeoffResult('missing','sorted'),{counts:[4,4],cost:16,feasible:true});
 assert.equal(tradeoffResult('missing','hash').feasible,false);
 const q=tradeoffCreate();for(const id of Object.keys(tradeoffCases))q.trials[id]={seen:Object.keys(tradeoffPlans),answer:tradeoffBest(id)[0],checked:true};q.reflection='constraints';q.trials.missing.answer='sorted';assert.equal(tradeoffComplete(q),true);
});
test('a draft saved before the missing-number case retains its old progress',()=>{
 const old=tradeoffCreate();old.trials.single={seen:['scan'],answer:'scan',checked:true};delete old.trials.missing;
 const restored=tradeoffRestore(old);assert.deepEqual(restored.trials.single,old.trials.single);assert.deepEqual(restored.trials.missing,{seen:[],answer:null,checked:false});assert.equal(tradeoffComplete(restored),false);
});
test('every comparison, correct decision and reflection are required and drafts are copied',()=>{
 const q=tradeoffCreate();for(const id of Object.keys(tradeoffCases)){q.trials[id]={seen:Object.keys(tradeoffPlans),answer:tradeoffBest(id)[0],checked:true};}
 assert.equal(tradeoffComplete(q),false);q.reflection='constraints';assert.equal(tradeoffComplete(q),true);const copy=tradeoffRestore(q);copy.trials.single.seen.pop();assert.equal(tradeoffComplete(copy),false);assert.equal(tradeoffComplete(q),true);
 assert.throws(()=>tradeoffRestore({...q,trials:{...q.trials,single:{seen:['scan','scan'],answer:'scan',checked:true}}}));
});
