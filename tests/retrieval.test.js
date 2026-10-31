import test from 'node:test';
import assert from 'node:assert/strict';
import {scrolls,searchResult,searchStats,createRetrieval,restoreRetrieval,retrievalCorrect,retrievalComplete} from '../src/retrieval.js';
test('fixed searches return the expected sets and precision and recall counts',()=>{
 assert.deepEqual(searchResult('narrow'),['a','c']);assert.deepEqual(searchResult('broad'),['a','b','c','d','e']);
 assert.deepEqual(searchStats('narrow'),{hits:2,returned:2,total:3});assert.deepEqual(searchStats('broad'),{hits:3,returned:5,total:3});
 assert.deepEqual(Object.keys(scrolls).filter(k=>scrolls[k].relevant),['a','c','e']);assert.throws(()=>searchResult('other'),RangeError);
});
test('both searches require the right selection and each metric, and drafts validate',()=>{
 const s=createRetrieval();s.choices.narrow={selected:['a','c'],precision:'2/2',recall:'2/3',checked:true};s.choices.broad={selected:['a','b','c','d','e'],precision:'3/5',recall:'3/3',checked:true};
 assert.equal(retrievalComplete(s),true);const saved=restoreRetrieval(s);s.choices.broad.selected.pop();assert.equal(retrievalComplete(s),false);assert.equal(saved.choices.broad.selected.length,5);
 saved.choices.narrow.precision='2/3';assert.equal(retrievalCorrect('narrow',saved.choices.narrow),false);assert.throws(()=>restoreRetrieval({...saved,mode:'other'}),RangeError);saved.choices.narrow.selected=['a','a'];assert.throws(()=>restoreRetrieval(saved),RangeError);
});
