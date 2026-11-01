import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto,createPublicKey,verify as verifyNative} from 'node:crypto';
import {ecdsaLabCases,runEcdsaLab,createEcdsaLab,restoreEcdsaLab,ecdsaLabComplete} from '../src/ecdsa-lab.js';
test('all cases use real P-256 signatures and distinguish verification from trusted key binding',async()=>{
 const expected={honest:[true,true],body:[false,true],signature:[false,true],wrongKey:[false,false],substituted:[true,false],replay:[true,true]};
 for(const id of Object.keys(ecdsaLabCases)){const r=await runEcdsaLab(webcrypto.subtle,id);assert.deepEqual([r.verified,r.trustedKey],expected[id]);assert.equal(r.signature.length,64);assert.equal(r.replayed,id==='replay');assert.equal(r.previouslyAccepted,id==='replay'?true:null);}
 await assert.rejects(runEcdsaLab(webcrypto.subtle,'unknown'));
});
test('Web Crypto signature interoperates with independent native P-256 verification',async()=>{
 const subtle=webcrypto.subtle,pair=await subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
 const data=new TextEncoder().encode('CS Quest'),sig=await subtle.sign({name:'ECDSA',hash:'SHA-256'},pair.privateKey,data);
 const jwk=await subtle.exportKey('jwk',pair.publicKey),key=createPublicKey({key:jwk,format:'jwk'});
 assert.equal(verifyNative('sha256',data,{key,dsaEncoding:'ieee-p1363'},new Uint8Array(sig)),true);
});
test('all six cases and the identity-binding reflection are needed, and invalid records fail',()=>{
 const s=createEcdsaLab();s.tested=Object.keys(ecdsaLabCases);s.answer='binding';s.checked=true;assert.ok(ecdsaLabComplete(restoreEcdsaLab(s)));
 assert.throws(()=>restoreEcdsaLab({...s,tested:['honest','honest']}));
});
