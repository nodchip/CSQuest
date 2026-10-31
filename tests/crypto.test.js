import test from 'node:test';
import assert from 'node:assert/strict';
import {cryptoCases,xorBits,createCrypto,cryptoCorrect,restoreCrypto,cryptoComplete} from '../src/crypto.js';
const bits=n=>[3,2,1,0].map(i=>(n>>i)&1);
test('XOR encrypts reversibly and reused keys reveal the second message if the first is known',()=>{
  for(let a=0;a<16;a++)for(let b=0;b<16;b++)for(let k=0;k<16;k++){
    const key=bits(k),p=bits(a),q=bits(b),ca=xorBits(p,key),cb=xorBits(q,key);
    assert.deepEqual(xorBits(ca,key),p);assert.deepEqual(xorBits(xorBits(p,ca),cb),q);
  }
});
test('every four-lamp answer is checked against independently computed bit differences',()=>{
  for(const [id,task] of Object.entries(cryptoCases))for(let n=0;n<16;n++)assert.deepEqual(cryptoCorrect(id,bits(n)),bits(n).map((v,i)=>v===(task.a[i]===task.b[i]?0:1)));
});
test('all checked correct cases are required and malformed saved lamps are rejected',()=>{
  const state=createCrypto();for(const [id,task] of Object.entries(cryptoCases)){state.bits[id]=xorBits(task.a,task.b);state.checked[id]=true;}assert.equal(cryptoComplete(restoreCrypto(state)),true);
  state.bits.first[0]^=1;assert.equal(cryptoComplete(state),false);assert.throws(()=>restoreCrypto({...state,bits:{...state.bits,first:[2,0,0,0]}}),RangeError);
});
