import {test} from 'node:test';
import assert from 'node:assert/strict';
import {modularPower,homomorphicResult,createHomomorphic,homomorphicComplete,restoreHomomorphic} from '../src/homomorphic-product.js';
test('multiplying the toy RSA ciphertexts decrypts to the plaintext product modulo 55',()=>{
 assert.deepEqual(homomorphicResult('first'),{ciphertexts:[8,27],combined:51,opened:6});assert.deepEqual(homomorphicResult('second'),{ciphertexts:[27,9],combined:23,opened:12});
 for(let a=0;a<55;a++)for(let b=0;b<55;b++){const c=modularPower(a,3,55)*modularPower(b,3,55)%55;assert.equal(modularPower(c,27,55),a*b%55);}
 assert.throws(()=>homomorphicResult('other'),RangeError);
});
test('both complete workflows are required and restored stages are independent',()=>{const s=createHomomorphic();s.stages.first=3;assert.equal(homomorphicComplete(s),false);s.stages.second=3;const copy=restoreHomomorphic(s);s.stages.first=0;assert.equal(homomorphicComplete(copy),true);assert.throws(()=>restoreHomomorphic({...copy,stages:{first:4,second:3}}),RangeError);});
