import {test} from 'node:test';
import assert from 'node:assert/strict';
import {wienerGains,wienerSamples,wienerMse,wienerOptimal,wienerCreate,wienerRun,wienerAccept,wienerComplete,wienerRestore} from '../src/wiener-crystal.js';

test('four equiprobable outcomes match independent MSE formula for every case and gain',()=>{
 for(const [id,sigma] of [['low',1],['high',3]])for(const [name,{n,d}] of Object.entries(wienerGains)){
  const g=n/d,rows=wienerSamples(id,name);assert.equal(rows.length,4);for(const r of rows){assert.equal(r.observed,r.signal+r.noise);assert(Math.abs(r.estimate-g*r.observed)<1e-12);}assert(Math.abs(wienerMse(id,name)-(4*(1-g)**2+sigma**2*g*g))<1e-12);
 }
});
test('optimal gain is signal power divided by signal plus noise power',()=>{
 for(const [id,noisePower] of [['low',1],['high',9]]){const best=wienerOptimal(id),{n,d}=wienerGains[best];assert.equal(n/d,4/(4+noisePower));for(const gain of Object.keys(wienerGains))assert(wienerMse(id,gain)>=wienerMse(id,best)-1e-12);}
});
test('comparison and optimal choice are required for both cases and saved records validated',()=>{
 const q=wienerCreate();for(const id of ['low','high']){q.selected=id;assert.throws(()=>wienerAccept(q));const t=q.trials[id];for(const choice of Object.keys(wienerGains)){t.choice=choice;wienerRun(q);wienerRun(q);assert.deepEqual(wienerRestore(q),q);}assert.equal(t.tested.length,5);assert.throws(()=>wienerAccept(q));t.choice=wienerOptimal(id);wienerAccept(q);assert.deepEqual(wienerRestore(q),q);}assert(!wienerComplete(q));q.answer='balance';assert(wienerComplete(q));const bad=structuredClone(q);bad.trials.low.choice='one';assert.throws(()=>wienerRestore(bad));
});
