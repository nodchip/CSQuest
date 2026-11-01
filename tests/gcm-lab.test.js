import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {runGcmLab,bytesHex,gcmPlaintexts,createGcmLab,gcmCaseId,gcmLabComplete,restoreGcmLab} from '../src/gcm-lab.js';
test('Web Crypto implementation passes the AES-GCM zero key, IV and plaintext known-answer vector',async()=>{
 const key=await webcrypto.subtle.importKey('raw',new Uint8Array(16),'AES-GCM',false,['encrypt']);
 const out=new Uint8Array(await webcrypto.subtle.encrypt({name:'AES-GCM',iv:new Uint8Array(12),tagLength:128},key,new Uint8Array(16)));
 assert.equal(bytesHex(out).replaceAll(' ',''),'0388dace60b6a392f328c2b971b2fe78ab6e47d42cec13bdf53a67b21257bddf');
});
test('actual GCM results show nonce reuse leakage and reject modified ciphertext',async()=>{
 for(const reuse of [true,false])for(const tamper of [true,false]){
  const r=await runGcmLab(webcrypto.subtle,reuse,tamper);assert.equal(r.accepted,!tamper);assert.equal(r.sameXor,reuse);
  assert.deepEqual(r.plainXor,Uint8Array.of(1,2,3,4));if(!tamper)assert.deepEqual(r.opened,gcmPlaintexts[1]);else assert.equal(r.opened,null);
  assert.equal(r.tagA.length,16);assert.equal(r.tagB.length,16);
 }
});
test('four observations and reflection required; records validated',()=>{
 const s=createGcmLab();for(const r of [true,false])for(const t of [true,false])s.tested.push(gcmCaseId(r,t));s.answer='unique';s.checked=true;assert.ok(gcmLabComplete(restoreGcmLab(s)));
 assert.throws(()=>restoreGcmLab({...s,tested:['same:changed','same:changed']}));
});
