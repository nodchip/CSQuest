import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {ecdhLabCases,runEcdhLab,createEcdhLab,restoreEcdhLab,ecdhLabComplete} from '../src/ecdh-lab.js';
test('real ECDH, HKDF and AES-GCM demonstrate direct exchange, interception and rejection',async()=>{
 assert.deepEqual(await runEcdhLab(webcrypto,'direct'),{rejected:false,receiver:true,shadow:false,forwarded:false});
 assert.deepEqual(await runEcdhLab(webcrypto,'intercept'),{rejected:false,receiver:false,shadow:true,forwarded:true});
 assert.deepEqual(await runEcdhLab(webcrypto,'authenticated'),{rejected:true,receiver:null,shadow:null,forwarded:null});
 await assert.rejects(runEcdhLab(webcrypto,'unknown'));
 await assert.rejects(runEcdhLab(null,'direct'));
});
test('all scenarios and reflection are required; corrupt drafts fail',()=>{
 const s=createEcdhLab(); assert.equal(ecdhLabComplete(s),false);
 s.tested=Object.keys(ecdhLabCases);s.answer='authenticate';s.checked=true;
 assert.equal(ecdhLabComplete(restoreEcdhLab(s)),true);
 assert.throws(()=>restoreEcdhLab({...s,tested:['direct','direct']}));
 assert.throws(()=>restoreEcdhLab({...s,guess:'invented'}));
});
