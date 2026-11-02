import {test} from 'node:test';
import assert from 'node:assert/strict';
import {watermarkSet,watermarkRead,watermarkEmbed,watermarkResult,watermarkCreate,watermarkWrite,watermarkVerify,watermarkTest,watermarkComplete,watermarkRestore} from '../src/image-watermark.js';

test('all byte values encode each bit with at most one unit of change',()=>{
 for(let value=0;value<256;value++)for(const bit of [0,1]){const result=watermarkSet(value,bit);assert.equal(result%2,bit);assert(Math.abs(result-value)<=1);assert.equal(Math.floor(result/2),Math.floor(value/2));}assert.throws(()=>watermarkSet(256,0));assert.throws(()=>watermarkSet(1,2));
});
test('four paths demonstrate unchanged mark, corruption, quantization and a forged match',()=>{
 const expected={plain:{pixels:[9,12,9,12],bits:[1,0,1,0],mismatches:0},change:{pixels:[8,12,9,12],bits:[0,0,1,0],mismatches:1},quantize:{pixels:[11,11,11,11],bits:[1,1,1,1],mismatches:2},forge:{pixels:[15,14,15,14],bits:[1,0,1,0],mismatches:0}};
 for(const [id,e] of Object.entries(expected)){const r=watermarkResult(id);assert.deepEqual(r.pixels,e.pixels);assert.deepEqual(r.bits,e.bits);assert.equal(r.mismatches,e.mismatches);assert.deepEqual(watermarkRead(r.pixels),e.bits);}assert.deepEqual(watermarkEmbed([14,14,14,14],[1,0,1,0]),expected.forge.pixels);
});
test('embedding and all paths are required, edits invalidate observations and drafts validate',()=>{
 const q=watermarkCreate();assert.throws(()=>watermarkTest(q,'plain'));for(const [i,bit] of [1,0,1,0].entries()){q.selected=i;watermarkWrite(q,bit);assert.deepEqual(watermarkRestore(q),q);}watermarkVerify(q);for(const id of ['plain','change','quantize','forge']){watermarkTest(q,id);assert.deepEqual(watermarkRestore(q),q);}assert(!watermarkComplete(q));q.answer='not-proof';assert(watermarkComplete(q));const bad=structuredClone(q);bad.bits[0]=0;assert.throws(()=>watermarkRestore(bad));watermarkWrite(q,0);assert.equal(q.verified,false);assert.deepEqual(q.tested,[]);
});
