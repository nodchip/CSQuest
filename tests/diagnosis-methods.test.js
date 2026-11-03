import test from 'node:test';
import assert from 'node:assert/strict';
import {diagnosisObserve,diagnosisModel,diagnosisSuggest,diagnosisScenes,diagnosisMethods,diagnosisMethodsCreate,diagnosisMethodsRestore,diagnosisMethodsDone} from '../src/diagnosis-methods.js';
test('minimal model diagnoses depend on assumptions and observations',()=>{
 assert.deepEqual(diagnosisModel({lamp:false,bell:false},1),[['battery']]);
 assert.deepEqual(diagnosisModel({lamp:false,bell:false},2),[['battery'],['lamp','bell']]);
 assert.deepEqual(diagnosisModel({lamp:false,bell:true},2),[['lamp']]);
 assert.deepEqual(diagnosisObserve(['lamp','bell']),{lamp:false,bell:false});assert.deepEqual(diagnosisObserve(['battery']),{lamp:false,bell:false});
 assert.deepEqual(diagnosisSuggest('double','case'),[['battery']]);assert.deepEqual(diagnosisSuggest('double','rule'),[['battery']]);
});
test('enumeration agrees with independently listed minimal diagnoses for every output',()=>{
 const expected={'true,true':[[]],'false,true':[['lamp']],'true,false':[['bell']],'false,false':[['battery'],['lamp','bell']]};
 for(const lamp of [true,false])for(const bell of [true,false])assert.deepEqual(diagnosisModel({lamp,bell},2),expected[`${lamp},${bell}`]);
});
test('both methods and scenarios, probe, repairs and reflection are required and copied',()=>{
 const q=diagnosisMethodsCreate();q.seen=Object.keys(diagnosisScenes).flatMap(s=>Object.keys(diagnosisMethods).map(m=>`${s}:${m}`));q.probed=['double'];q.repairs={wire:['lamp'],double:['battery','lamp','bell']};q.reflection='limits';assert.equal(diagnosisMethodsDone(q),true);
 const copy=diagnosisMethodsRestore(q);copy.repairs.double.pop();assert.equal(q.repairs.double.length,3);assert.equal(diagnosisMethodsDone(copy),false);assert.throws(()=>diagnosisMethodsRestore({...q,seen:['wire:unknown']}));assert.throws(()=>diagnosisMethodsRestore({...q,repairs:{wire:[],double:['lamp','lamp']}}));
});
