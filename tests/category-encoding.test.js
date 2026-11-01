import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeCategory,encodingModes,encodingRows,createCategoryEncoding,categoryEncodingComplete,restoreCategoryEncoding} from '../src/category-encoding.js';
test('known, unknown, and missing categories have the intended encodings',()=>{
 assert.deepEqual(Object.keys(encodingRows).map(r=>encodeCategory('zero',r)),[[1,0,0],[0,1,0],[0,0,1],[0,0,0],[0,0,0]]);
 assert.deepEqual(Object.keys(encodingRows).map(r=>encodeCategory('reserved',r)),[[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,0,0,1]]);
 assert.throws(()=>encodeCategory('bad','red'));assert.throws(()=>encodeCategory('zero','bad'));
});
test('completion requires all ten conversions and qualified conclusion',()=>{
 const s=createCategoryEncoding();s.observed=Object.keys(encodingModes).flatMap(m=>Object.keys(encodingRows).map(r=>`${m}:${r}`));s.answer='limits';s.checked=true;assert.ok(categoryEncodingComplete(s));assert.deepEqual(restoreCategoryEncoding(s),s);s.observed.pop();assert.equal(categoryEncodingComplete(s),false);assert.throws(()=>restoreCategoryEncoding({...s,bits:8}));assert.throws(()=>restoreCategoryEncoding({...s,observed:['zero:red','zero:red']}));
});
