import test from 'node:test';
import assert from 'node:assert/strict';
import {fixedMultiplyResult,createFixedMultiply,fixedMultiplyComplete,restoreFixedMultiply} from '../src/fixed-multiply.js';

test('all 65536 signed operand pairs use a wide product and independently rounded result',()=>{
 const view=new DataView(new ArrayBuffer(2));for(let a=-128;a<=127;a++)for(let b=-128;b<=127;b++){
  const r=fixedMultiplyResult(a,b),p=a*b,sign=p<0?-1:1,abs=Math.abs(p),whole=Math.floor(abs/16),rem=abs%16,nearest=sign*(whole+(rem>8||(rem===8&&whole%2===1)?1:0));
  view.setInt16(0,p);assert.equal(parseInt(r.productBits,2),view.getUint16(0));assert.equal(r.product,p);assert.equal(r.rounded,nearest===0?0:nearest);assert.equal(r.inRange,nearest>=-128&&nearest<=127);
  if(r.inRange){assert.equal(r.value,nearest===0?0:nearest/16);assert.ok(Math.abs(r.value-p/256)<=1/32);}
 }
});
test('representable final values can be lost if the intermediate is truncated',()=>{
 const a=fixedMultiplyResult(48,32);assert.equal(a.exact,6);assert.equal(a.value,6);assert.equal(a.wrapped,0);assert.equal(a.naiveValue,0);assert.equal(fixedMultiplyResult(48,48).inRange,false);assert.equal(fixedMultiplyResult(8,1).value,0);assert.equal(fixedMultiplyResult(24,1).value,.125);assert.equal(fixedMultiplyResult(-24,24).value,-2.25);
});
test('five comparisons and reflection are required and restored independently',()=>{
 const s=createFixedMultiply();s.observed=['48,32','48,48','8,1','24,1','-24,24'];s.answer='wide';s.checked=true;const copy=restoreFixedMultiply(s);assert.equal(fixedMultiplyComplete(copy),true);copy.observed.pop();assert.equal(s.observed.length,5);assert.equal(fixedMultiplyComplete(copy),false);assert.throws(()=>restoreFixedMultiply({...s,observed:['48,32','48,32']}));
});
