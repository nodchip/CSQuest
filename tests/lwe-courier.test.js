import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lweCourierResult,lweCourierCreate,lweCourierCheck,lweCourierComplete,lweCourierRestore} from '../src/lwe-courier.js';
test('all public sample subsets and both bits agree with independently calculated ciphertexts and circular distances',()=>{const samples=[[[1,1],5],[[2,1],8],[[1,2],7]],mod=x=>(x%17+17)%17;for(let bit=0;bit<2;bit++)for(let mask=1;mask<8;mask++)for(const offset of [0,5]){let x=0,y=0,v=8*bit+offset;for(let i=0;i<3;i++)if(mask&(1<<i)){x+=samples[i][0][0];y+=samples[i][0][1];v+=samples[i][1];}const residual=mod(v-2*x-3*y),d0=Math.min(residual,17-residual),d1=Math.min(mod(residual-8),mod(8-residual)),r=lweCourierResult(bit,mask,offset);assert.deepEqual(r.u,[mod(x),mod(y)]);assert.equal(r.v,mod(v));assert.equal(r.residual,residual);assert.equal(r.decoded,d0<d1?0:1);if(offset===0)assert.equal(r.decoded,bit);}});
test('requires correct predictions and actual modified outcomes for both bits, with valid restored evidence',()=>{const q=lweCourierCreate();for(const bit of [0,1])for(const offset of [0,5]){q.bit=bit;q.offset=offset;let t=q.trials[`${bit}-${offset}`];t.mask=1;t.answer=1-bit;assert.equal(lweCourierCheck(q),offset===5);t.answer=lweCourierResult(bit,1,offset).decoded;assert(lweCourierCheck(q));assert.deepEqual(lweCourierRestore(q),q);}assert(!lweCourierComplete(q));q.reflection='limits';assert(lweCourierComplete(q));const b=structuredClone(q);b.trials['1-5'].mask=4;assert.throws(()=>lweCourierRestore(b));});
test('the tiny public example allows exhaustive search and does not uniquely determine the secret with bounded noise',()=>{
 const samples=[[[1,1],5],[[2,1],8],[[1,2],7]],candidates=[];
 for(let x=0;x<17;x++)for(let y=0;y<17;y++){
  const errors=samples.map(([[a,b],v])=>(v-a*x-b*y+17*10)%17);
  if(errors.every(e=>[0,1,16].includes(e)))candidates.push([x,y]);
 }
 assert.deepEqual(candidates,[[2,3],[3,2],[4,1]]);
});
