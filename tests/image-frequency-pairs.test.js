import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pairInput,pairDft,pairInverse,pairResult,pairCreate,pairApply,pairComplete,pairRestore} from '../src/image-frequency-pairs.js';

test('direct transform gives the expected four nonzero complex coefficients and round trips',()=>{
 const f=pairDft(pairInput);for(let i=0;i<16;i++)assert.deepEqual(f[i],i===0?{re:48,im:0}:i===1?{re:0,im:-8}:i===3?{re:0,im:8}:i===8?{re:16,im:0}:{re:0,im:0});
 assert.deepEqual(pairInverse(f),pairInput.map(re=>({re,im:0})));
});
test('all masks agree with an independently constructed spatial wave and conjugate symmetry',()=>{
 const wave=[0,1,0,-1],cos=[1,0,-1,0];for(let mask=0;mask<16;mask++){
  const A=Number(Boolean(mask&2)),B=Number(Boolean(mask&4)),expected=pairInput.map((_,i)=>({re:(mask&1?3:0)+(mask&8?(Math.floor(i/4)%2?-1:1):0)+(A+B)*wave[i%4]/2,im:(B-A)*cos[i%4]/2}));
  const result=pairResult(mask);for(let i=0;i<16;i++){assert.equal(result.pixels[i].re,expected[i].re||0);assert.equal(result.pixels[i].im,expected[i].im||0);}assert.equal(result.real,A===B);
 }
});
test('three objectives, asymmetric observation and reflection are required and drafts validated',()=>{
 const q=pairCreate();q.trials.removeRows.mask=13;assert(!pairApply(q));assert(q.asymmetric);for(const [id,mask] of [['removeRows',7],['removeColumns',9],['isolateColumns',6]]){q.selected=id;const t=q.trials[id];t.mask=mask;t.observed=false;t.passed=false;assert(pairApply(q));assert.deepEqual(pairRestore(q),q);}assert(!pairComplete(q));q.answer='paired';assert(pairComplete(q));const bad=structuredClone(q);bad.trials.isolateColumns.mask=2;assert.throws(()=>pairRestore(bad));
});
