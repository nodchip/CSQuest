import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dctImages,dctSteps,dctTransform,dctInverse,dctResult,dctEligible,dctCreate,dctRun,dctAccept,dctComplete,dctRestore,waveletResult} from '../src/image-dct.js';

test('2D DCT matches independently calculated cosine basis and round trips 81 blocks',()=>{
 for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++)for(let d=-1;d<=1;d++){
  const p=[a,b,c,d],actual=dctTransform(p);for(let u=0;u<2;u++)for(let v=0;v<2;v++){let expected=0;for(let r=0;r<2;r++)for(let col=0;col<2;col++)expected+=p[r*2+col]*Math.cos((2*r+1)*u*Math.PI/4)*Math.cos((2*col+1)*v*Math.PI/4);expected*=u===0?Math.SQRT1_2:1;expected*=v===0?Math.SQRT1_2:1;assert(Math.abs(actual[u*2+v]-expected)<1e-12);}assert.deepEqual(dctInverse(actual).map(x=>x||0),p.map(x=>x||0));
 }
});
test('quantization preserves flat blocks and changes details with explicit tie behavior',()=>{
 for(const id of Object.keys(dctImages))for(const step of dctSteps){const r=dctResult(id,step);if(id==='flat'){assert.deepEqual(r.output,[10,10,10,10]);assert.equal(r.nonzero,1);assert.equal(r.mse,0);assert(dctEligible(id,step));}else if(step<=4){assert.deepEqual(r.output,dctImages[id].pixels);assert.equal(r.nonzero,2);assert.equal(r.mse,0);assert(!dctEligible(id,step));}else if(step===8){assert.equal(r.nonzero,2);assert.equal(r.mse,4);assert(!dctEligible(id,step));assert(r.quantized.includes(-1));}else{assert.deepEqual(r.output,[10,10,10,10]);assert.equal(r.nonzero,1);assert.equal(r.mse,4);assert(dctEligible(id,step));}}
});
test('all experiments, an eligible choice, and reflection are required; drafts validate',()=>{
 const q=dctCreate();for(const id of Object.keys(dctImages)){q.selected=id;const t=q.trials[id];assert.throws(()=>dctAccept(q));for(const step of dctSteps){t.step=step;dctRun(q);dctRun(q);assert.deepEqual(dctRestore(q),q);}if(id!=='flat'){t.step=1;assert.throws(()=>dctAccept(q));t.step=16;}dctAccept(q);assert.deepEqual(dctRestore(q),q);}assert(!dctComplete(q));q.answer='tradeoff';assert(dctComplete(q));const bad=structuredClone(q);bad.trials.stripe.step=1;assert.throws(()=>dctRestore(bad));
});
test('two-scale Haar averages and details reconstruct locally for all four choices',()=>{for(const [left,right,output] of [[true,true,[8,12,6,14]],[false,true,[10,10,6,14]],[true,false,[8,12,10,10]],[false,false,[10,10,10,10]]]){const r=waveletResult(left,right);assert.equal(r.average,10);assert.equal(r.coarse,0);assert.deepEqual(r.details,[-2,-4]);assert.deepEqual(r.output,output);}assert.throws(()=>waveletResult(1,true));const q=dctCreate();q.wavelet={left:false,right:true,run:true};assert.deepEqual(dctRestore(q).wavelet,q.wavelet);const old={...q};delete old.wavelet;assert.deepEqual(dctRestore(old).wavelet,{left:true,right:true,run:false});assert.throws(()=>dctRestore({...q,wavelet:{left:0,right:true,run:true}}));});
