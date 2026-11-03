import test from 'node:test';
import assert from 'node:assert/strict';
import {remoteImpactMeasure,remoteImpactCreate,remoteImpactRun,remoteImpactDone,remoteImpactRestore,remoteImpactRequired} from '../src/remote-impact.js';

test('all eight fixed assumptions sum the separate sources and include a tie',()=>{
 for(const [office,o] of [['keep',120],['reduce',30]])for(const [home,h] of [['low',30],['high',100]])for(const [network,n] of [['low',20],['high',80]]){
  const r=remoteImpactMeasure({office,home,network}),total=o+4*h+n;
  assert.deepEqual(r,{baseline:320,office:o,home:4*h,network:n,remote:total,relation:total<320?'less':total>320?'more':'equal'});
 }
 assert.equal(remoteImpactMeasure({office:'keep',home:'low',network:'high'}).relation,'equal');
});
test('only correct predictions count and required comparisons plus reflection are needed',()=>{
 const q=remoteImpactCreate();q.prediction='more';assert.equal(remoteImpactRun(q).correct,false);assert.deepEqual(q.seen,[]);
 for(const key of remoteImpactRequired){const [office,home,network]=key.split(':');Object.assign(q,{office,home,network});q.prediction=remoteImpactMeasure(q).relation;assert.equal(remoteImpactRun(q).correct,true);}
 q.answer='boundary';assert.equal(remoteImpactDone(q),false);q.checked=true;assert.equal(remoteImpactDone(q),true);
 const copy=remoteImpactRestore(q);copy.seen.pop();assert.equal(q.seen.length,5);q.seen.push('keep:low:unknown');assert.throws(()=>remoteImpactRestore(q));
});
