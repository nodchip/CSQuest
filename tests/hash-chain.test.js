import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto,createHash} from 'node:crypto';
import {chainDigest,evaluateHashChain,hashChainRecords,createHashChain,hashChainComplete,restoreHashChain} from '../src/hash-chain.js';
test('Web Crypto digest matches independent Node SHA-256 over the specified encoding',async()=>{
 const data=JSON.stringify([1,hashChainRecords[0][0],'0'.repeat(64)]);
 assert.equal(await chainDigest(webcrypto.subtle,1,hashChainRecords[0][0],'0'.repeat(64)),createHash('sha256').update(data).digest('hex'));
});
test('each block edit is detected and repairing forward restores links but changes the independent anchor',async()=>{
 const original=await evaluateHashChain(webcrypto.subtle,null,[]);assert.equal(original.valid,true);assert.equal(original.anchorMatches,true);
 for(let i=0;i<3;i++){
  const damaged=await evaluateHashChain(webcrypto.subtle,i,[]);assert.equal(damaged.valid,false);assert.equal(damaged.blocks[i].validHash,false);assert.equal(damaged.anchorMatches,true);
  const repaired=await evaluateHashChain(webcrypto.subtle,i,Array.from({length:3-i},(_,n)=>i+n));assert.equal(repaired.valid,true);assert.equal(repaired.anchorMatches,false);assert.notEqual(repaired.blocks[2].hash,original.anchor);
  if(i<2){const wrong=await evaluateHashChain(webcrypto.subtle,i,[i+1,i]);assert.equal(wrong.valid,false);}
 }
 await assert.rejects(evaluateHashChain(null,null,[]));
});
test('all observations and reflection are required and saved histories are copied and validated',()=>{
 const s=createHashChain();s.observed=['original','broken','forged'];s.answer='anchor';s.checked=true;assert.equal(hashChainComplete(restoreHashChain(s)),true);
 const r=restoreHashChain(s);r.observed.pop();assert.equal(s.observed.length,3);
 assert.throws(()=>restoreHashChain({...s,repairs:[0]}));assert.throws(()=>restoreHashChain({...s,observed:['forged','forged']}));
});
