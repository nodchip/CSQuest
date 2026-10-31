import test from 'node:test';
import assert from 'node:assert/strict';
import {createDictionaryTrial,stepDictionary,dictionaryGet,dictionaryCorrect,createDictionarySet,dictionaryComplete,restoreDictionarySet} from '../src/dictionary-adt.js';

test('sorted records and colliding hash buckets implement the same dictionary operations',()=>{
  const all=createDictionarySet();for(const mode of ['sorted','hash']){let s=createDictionaryTrial(mode);for(const action of [['set','C','green'],['set','B','green'],['delete','A','red'],['get','A','red'],['get','C','red']])s=stepDictionary(s,...action);s.checked=true;assert.ok(dictionaryCorrect(s));assert.deepEqual(dictionaryGet(s.storage,mode,'A'),{found:false,value:null});assert.deepEqual(dictionaryGet(s.storage,mode,'C'),{found:true,value:'green'});all.trials[mode]=s;}assert.ok(dictionaryComplete(all));
});
test('updates replace a value and observations expire after mutations',()=>{
  let s=createDictionaryTrial('hash');s=stepDictionary(s,'delete','C','red');assert.match(s.message,/記録は変わりません/);s=stepDictionary(s,'set','B','green');assert.equal(s.storage[1].length,1);s=stepDictionary(s,'get','C','red');assert.equal(s.observed.C,null);s=stepDictionary(s,'set','C','green');assert.deepEqual(s.observed,{});const trials={sorted:{history:[],selection:{key:'A',value:'red'},checked:false},hash:{history:s.history,selection:{key:'C',value:'green'},checked:false}};assert.equal(dictionaryGet(restoreDictionarySet({selected:'hash',trials}).trials.hash.storage,'hash','C').value,'green');assert.throws(()=>restoreDictionarySet({selected:'hash',trials:{...trials,hash:{...trials.hash,history:[['set','Z','red']]}}}));
});
