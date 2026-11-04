import test from 'node:test';
import assert from 'node:assert/strict';
import {createDns,dnsStep,dnsComplete,restoreDns,dnsExperiment,dnsExperimentCorrect} from '../src/dns-resolution.js';
test('referrals, an unexpired cache hit, and expiry follow the model',()=>{let s=createDns();assert.throws(()=>dnsStep(s,'authority'));for(const action of ['query','root','tld','authority','wait','query'])s=dnsStep(s,action);assert.equal(s.time,2);assert.equal(s.fresh,true);assert.equal(s.expiry,4);s=dnsStep(s,'wait');s=dnsStep(s,'query');assert.equal(s.phase,'root');for(const action of ['root','tld','authority'])s=dnsStep(s,action);assert.equal(s.expired,true);assert.equal(s.expiry,8);s.answer='cache';s.checked=true;assert.ok(dnsComplete(s));assert.deepEqual(restoreDns(s),s);});
test('old answers cannot be claimed fresh at expiry and history is replayed',()=>{let s=createDns();for(const action of ['query','root','tld','authority','wait'])s=dnsStep(s,action);assert.throws(()=>dnsStep(s,'wait'));assert.throws(()=>restoreDns({...s,history:['query','authority']}));assert.equal(dnsComplete({...s,first:true,fresh:true,expired:false,answer:'cache',checked:true}),false);});
test('an authoritative update need not invalidate an unexpired cached answer',()=>{
 assert.deepEqual(dnsExperiment(0),{authoritative:'192.0.2.42',source:'cache',answer:'192.0.2.42',stale:false});
 for(const time of [1,3])assert.deepEqual(dnsExperiment(time),{authoritative:'192.0.2.84',source:'cache',answer:'192.0.2.42',stale:true});
 for(const time of [4,5])assert.deepEqual(dnsExperiment(time),{authoritative:'192.0.2.84',source:'authority',answer:'192.0.2.84',stale:false});
 assert.throws(()=>dnsExperiment(2));const old=createDns();delete old.experimentTime;assert.equal(restoreDns(old).experimentTime,0);assert.equal(restoreDns({...old,experimentTime:3}).experimentTime,3);assert.throws(()=>restoreDns({...old,experimentTime:2}));
});
test('predicted answer changes at expiration and old drafts remain compatible',()=>{
 for(const time of [0,1,3]){assert.equal(dnsExperimentCorrect(time,'old'),true);assert.equal(dnsExperimentCorrect(time,'new'),false);}
 for(const time of [4,5]){assert.equal(dnsExperimentCorrect(time,'old'),false);assert.equal(dnsExperimentCorrect(time,'new'),true);}
 assert.throws(()=>dnsExperimentCorrect(0,'unknown'));const old=createDns();delete old.experimentGuess;delete old.experimentChecked;
 assert.equal(restoreDns(old).experimentChecked,false);assert.equal(restoreDns({...old,experimentGuess:'new',experimentChecked:true}).experimentGuess,'new');
 assert.throws(()=>restoreDns({...old,experimentChecked:true}));
});
