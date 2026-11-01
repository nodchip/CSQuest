import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto,createHash} from 'node:crypto';
import {forkDigest,forkRecords,forkBranch,mineForkBlock,compareForks,createProofFork,proofForkComplete,restoreProofFork} from '../src/proof-fork.js';
const subtle=webcrypto.subtle;
test('hash encoding matches an independent SHA-256 implementation',async()=>{
 const prev='0'.repeat(64),input=JSON.stringify([1,forkRecords.a[0],prev,0]);
 assert.equal(await forkDigest(subtle,1,forkRecords.a[0],prev,0),createHash('sha256').update(input).digest('hex'));
});
test('mine both forks, compare equal work and longer work, and reject edited payload',async()=>{
 const s=createProofFork();
 for(const branch of ['a','b']){const mined=await mineForkBlock(subtle,branch,s[branch]);assert.ok(mined.hash.startsWith('0'));assert.equal(mined.attempts,mined.nonce+1);s[branch].push(mined.nonce);}
 assert.equal((await compareForks(subtle,s)).choice,'tie');
 s.b.push((await mineForkBlock(subtle,'b',s.b)).nonce);assert.equal((await compareForks(subtle,s)).choice,'b');
 s.corrupt=true;const tampered=await compareForks(subtle,s);assert.equal(tampered.b.valid,false);assert.equal(tampered.choice,'a');
 assert.equal(tampered.b.blocks[0].valid,false);assert.ok(tampered.b.blocks[0].hash.startsWith('0'));
 const wrong=await forkBranch(subtle,'a',[2047]);assert.equal(wrong.valid,false);
 await assert.rejects(mineForkBlock(subtle,'a',[2047]));
});
test('completion and saved draft validation',()=>{
 const s=createProofFork();s.observed=['tie','longer','invalid'];s.answer='work';s.checked=true;assert.ok(proofForkComplete(restoreProofFork(s)));
 assert.throws(()=>restoreProofFork({...s,a:[-1]}));assert.throws(()=>restoreProofFork({...s,observed:['tie','tie']}));
});
