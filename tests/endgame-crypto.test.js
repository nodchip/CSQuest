import test from 'node:test';
import assert from 'node:assert/strict';
import {makeDemoPacket,openDemoPacket,demoDigest,replayCrypto} from '../src/endgame-crypto.js';

test('AES-GCM opens with the matching key but rejects a wrong key and modified ciphertext',async()=>{
 const a=await makeDemoPacket(),b=await makeDemoPacket();assert.notEqual(a.key,b.key);assert.equal(a.iv.length,24);
 assert.deepEqual(await openDemoPacket(a),{ok:true,text:'灯りを届けて'});assert.deepEqual(await openDemoPacket(a,{wrong:true}),{ok:false});assert.deepEqual(await openDemoPacket(a,{modified:true}),{ok:false});
 const seal=`sealed:${a.key}:${a.iv}:${a.ciphertext}`;assert.equal(replayCrypto('encrypt',[seal,'wrong','right','finish']).done,true);assert.equal(replayCrypto('encrypt',[seal,'right']),null);
 assert.equal(replayCrypto('integrity',[seal,'alter','changed','restore','right','finish']).done,true);
});
test('SHA-256 agrees for equal messages and differs on the chosen changed message',async()=>{
 const d=await Promise.all([0,1,2].map(demoDigest));assert.equal(d[0],d[1]);assert.notEqual(d[0],d[2]);
 assert.equal(d[0].length,64);const h=d.map((value,i)=>`digest:${i}:${value}`);assert.equal(replayCrypto('digest',[...h,'finish']).done,true);assert.equal(replayCrypto('digest',[h[1]]),null);
});
