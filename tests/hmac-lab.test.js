import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {bytesHex} from '../src/gcm-lab.js';
import {hmacLabModes,hmacLabActions,runHmacLab,createHmacLab,restoreHmacLab,hmacLabComplete} from '../src/hmac-lab.js';
test('HMAC-SHA-256 agrees with RFC 4231 test case 1',async()=>{
 const subtle=webcrypto.subtle,key=await subtle.importKey('raw',new Uint8Array(20).fill(0x0b),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const tag=new Uint8Array(await subtle.sign('HMAC',key,new TextEncoder().encode('Hi There')));
 assert.equal(bytesHex(tag).replaceAll(' ',''),'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
});
test('eight actual digest and HMAC experiments match independently expected outcomes',async()=>{
 const wanted={hash:{honest:true,edit:false,replace:true,replay:true},hmac:{honest:true,edit:false,replace:false,replay:true}};
 for(const mode of Object.keys(hmacLabModes))for(const action of Object.keys(hmacLabActions)){
  const r=await runHmacLab(webcrypto.subtle,mode,action);assert.equal(r.accepted,wanted[mode][action]);assert.equal(r.replayed,action==='replay');assert.equal(r.tag.length,32);assert.equal(r.expected.length,32);
 }
 await assert.rejects(runHmacLab(webcrypto.subtle,'unknown','edit'));
});
test('all eight experiments and reflection are needed; invalid records are rejected',()=>{
 const s=createHmacLab();s.tested=Object.keys(hmacLabModes).flatMap(m=>Object.keys(hmacLabActions).map(a=>`${m}:${a}`));s.answer='auth';s.checked=true;assert.ok(hmacLabComplete(restoreHmacLab(s)));
 assert.throws(()=>restoreHmacLab({...s,tested:['hash:edit','hash:edit']}));
});
