import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {runCryptoCargo,cryptoCargoSizes,createCryptoCargo,cryptoCargoComplete,restoreCryptoCargo} from '../src/crypto-cargo.js';
test('real AES-GCM, RSA-OAEP and key wrapping round trip for all three message sizes',async()=>{
 for(const size of cryptoCargoSizes){const r=await runCryptoCargo(webcrypto.subtle,performance,size);assert.equal(r.aesBytes,size+16);assert.equal(r.ivBytes,12);assert.equal(r.rsaBytes,size<=190?256:null);assert.equal(r.oversizeRejected,size>190);assert.equal(r.wrappedBytes,256);assert.equal(r.hybridBytes,size+16+12+256);assert.equal(r.roundTrip,true);assert.equal(r.samples,9);assert.ok(r.aesMedian>=0);if(size<=190)assert.ok(r.rsaMedian>=0);}
 await assert.rejects(runCryptoCargo(null,performance,16));
});
test('RSA-OAEP SHA-256 2048-bit limit accepts 190 bytes and rejects 191 bytes',async()=>{
 const s=webcrypto.subtle,k=await s.generateKey({name:'RSA-OAEP',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},false,['encrypt','decrypt']);
 assert.equal((await s.encrypt('RSA-OAEP',k.publicKey,new Uint8Array(190))).byteLength,256);
 await assert.rejects(s.encrypt('RSA-OAEP',k.publicKey,new Uint8Array(191)),{name:'OperationError'});
});
test('all sizes and reflection are required and draft choices validated',()=>{
 const s=createCryptoCargo();s.tested=[...cryptoCargoSizes];s.answer='measurement';s.checked=true;assert.ok(cryptoCargoComplete(restoreCryptoCargo(s)));
 assert.throws(()=>restoreCryptoCargo({...s,tested:[16,16]}));assert.throws(()=>restoreCryptoCargo({...s,size:17}));
});
