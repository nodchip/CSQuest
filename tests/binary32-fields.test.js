import test from 'node:test';
import assert from 'node:assert/strict';
import {binary32Interpret,createBinary32Fields,binary32FieldsComplete,restoreBinary32Fields} from '../src/binary32-fields.js';

test('all exponent fields and representative fractions agree with DataView',()=>{
 const view=new DataView(new ArrayBuffer(4));for(const sign of [0,1])for(let exponent=0;exponent<=255;exponent++)for(const fraction of [0,1,4194304,5033165,8388607]){
  const r=binary32Interpret(sign,exponent,fraction);view.setUint32(0,r.word);const reference=view.getFloat32(0);if(Number.isNaN(reference))assert.equal(r.kind,'nan');else assert.ok(Object.is(r.value,reference));assert.equal(parseInt(r.bits,2),r.word);
 }
});
test('boundary values, signs, and 0.1 representation are classified',()=>{
 assert.ok(Object.is(binary32Interpret(1,0,0).value,-0));assert.equal(binary32Interpret(0,0,1).value,2**-149);assert.equal(binary32Interpret(0,1,0).value,2**-126);assert.equal(binary32Interpret(0,123,5033165).value,Math.fround(.1));assert.equal(binary32Interpret(0,255,0).value,Infinity);assert.equal(binary32Interpret(1,255,0).value,-Infinity);assert.ok(Number.isNaN(binary32Interpret(0,255,1).value));
});
test('all seven observations and correct reflection are required',()=>{
 const s=createBinary32Fields();s.observed=['0,0,0','1,0,0','0,0,1','0,1,0','0,123,5033165','0,255,0','0,255,1'];s.answer='special';s.checked=true;const copy=restoreBinary32Fields(s);assert.equal(binary32FieldsComplete(copy),true);copy.observed.pop();assert.equal(s.observed.length,7);assert.equal(binary32FieldsComplete(copy),false);assert.throws(()=>restoreBinary32Fields({...s,observed:['0,0,0','0,0,0']}));
});
