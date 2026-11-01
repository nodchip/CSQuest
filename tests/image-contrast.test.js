import test from 'node:test';
import assert from 'node:assert/strict';
import {contrastCases,contrastModes,contrastResult,contrastCreate,contrastComplete,contrastRestore} from '../src/image-contrast.js';
test('histograms count pixels and linear stretching preserves order and endpoints',()=>{
 for(const id of Object.keys(contrastCases)){const input=contrastCases[id].pixels;for(const mode of Object.keys(contrastModes)){const r=contrastResult(id,mode);assert.equal(r.hist.reduce((a,b)=>a+b,0),16);for(let i=0;i<7;i++)assert.equal(r.hist[i],r.pixels.filter(v=>v===i).length);if(mode==='original'||r.constant)assert.deepEqual(r.pixels,input);else {assert.equal(Math.min(...r.pixels),0);assert.equal(Math.max(...r.pixels),6);for(let i=0;i<16;i++)for(let j=0;j<16;j++)assert.equal(Math.sign(r.pixels[i]-r.pixels[j]),Math.sign(input[i]-input[j]));}}}
 assert.deepEqual(contrastResult('noise','stretch').hist,[15,0,0,0,0,0,1]);assert.equal(contrastResult('flat','stretch').constant,true);assert.throws(()=>contrastResult('bad','original'));
});
test('completion requires all six observations and the checked answer; drafts are independent',()=>{
 const s=contrastCreate();s.answer='noise';s.checked=true;assert.equal(contrastComplete(s),false);for(const id of Object.keys(contrastCases))for(const mode of Object.keys(contrastModes))s.seen[id][mode]=true;assert.equal(contrastComplete(s),true);const copy=contrastRestore(s);copy.seen.detail.original=false;assert.equal(contrastComplete(copy),false);assert.equal(contrastComplete(s),true);assert.throws(()=>contrastRestore({...s,seen:{}}));
});
