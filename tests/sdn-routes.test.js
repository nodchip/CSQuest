import test from 'node:test';
import assert from 'node:assert/strict';
import {sdnCases,createSdnTrial,sdnSend,createSdn,sdnCorrect,sdnComplete,saveSdn,restoreSdn} from '../src/sdn-routes.js';
test('path failures and alternative working rules reflect link and forwarding state',()=>{
 const broken=createSdnTrial('broken'),missing=createSdnTrial('missing');assert.equal(sdnSend('broken',broken).outcome,'link');assert.equal(sdnSend('missing',missing).outcome,'missing');broken.source='b';assert.equal(sdnSend('broken',broken).outcome,'delivered');missing.bRule=true;assert.equal(sdnSend('missing',missing).outcome,'delivered');missing.bRule=false;missing.source='a';assert.equal(sdnSend('missing',missing).outcome,'delivered');assert.throws(()=>sdnSend('bad',missing));
});
test('both scenarios require witnessing failure, a delivered trace and the control-plane explanation',()=>{
 const s=createSdn();for(const id of Object.keys(sdnCases)){const t=s.trials[id];assert.notEqual(sdnSend(id,t).outcome,'delivered');t.seenProblem=true;t.source='b';t.bRule=true;t.trace=sdnSend(id,t);t.reason='controller';t.checked=true;assert.equal(sdnCorrect(id,t),false);t.reason='rules';assert.equal(sdnCorrect(id,t),true);}assert.equal(sdnComplete(s),true);assert.deepEqual(restoreSdn(saveSdn(s)),s);const saved=saveSdn(s);saved.trials.broken.trace='fake';assert.throws(()=>restoreSdn(saved));
});
