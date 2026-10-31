import test from 'node:test';
import assert from 'node:assert/strict';
import {cdnCases,createCdn,cdnStep,cdnComplete,restoreCdn} from '../src/cdn-cache.js';
test('a fresh copy survives origin changes until expiration or explicit removal',()=>{
 const s=createCdn();for(const [id,c] of Object.entries(cdnCases)){let t=s.trials[id];assert.equal(cdnStep(id,t,'update',1).phase,0);t=cdnStep(id,t,'get',1);assert.deepEqual(t.cache,{version:1,expires:2});t=cdnStep(id,t,'update',1);assert.equal(cdnStep(id,t,'get',2).phase,2);t=cdnStep(id,t,'get',1);assert.equal(t.reads[1].from,'cache');t=cdnStep(id,t,c.refresh,1);t=cdnStep(id,t,'get',2);assert.deepEqual(t.reads.map(r=>[r.version,r.from]),[[1,'origin'],[1,'cache'],[2,'origin']]);if(id==='expiry')assert.equal(t.time,2);s.trials[id]=t;}s.reason='instant';s.checked=true;assert.equal(cdnComplete(s),false);s.reason='freshness';assert.equal(cdnComplete(s),true);assert.deepEqual(restoreCdn(s),s);
});
test('restore rejects impossible order and does not share history',()=>{
 const s=createCdn();s.trials.expiry=cdnStep('expiry',s.trials.expiry,'get',1);const copy=restoreCdn(s);copy.trials.expiry.history.push(['purge',1]);assert.throws(()=>restoreCdn(copy));assert.equal(s.trials.expiry.history.length,1);
});
