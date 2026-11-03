import test from 'node:test';
import assert from 'node:assert/strict';
import {latencyJobs,latencyUpgrades,latencyResult,latencyCreate,latencyRestore,latencyDone} from '../src/latency-bottlenecks.js';
test('three serial models identify different best upgrades',()=>{
 const totals={compute:[9,14,14.5],bandwidth:[14,9,14.5],latency:[15,15,10]};
 for(const j of Object.keys(latencyJobs)){
  assert.deepEqual(Object.keys(latencyUpgrades).map(u=>latencyResult(j,u).total),totals[j]);
  assert.equal(Object.keys(latencyUpgrades).reduce((a,b)=>latencyResult(j,a).total<latencyResult(j,b).total?a:b),j);
 }
});
test('all nine trials and explanations required and stored drafts validate',()=>{
 const q=latencyCreate();q.seen=Object.keys(latencyJobs).flatMap(j=>Object.keys(latencyUpgrades).map(u=>`${j}:${u}`));q.answers={compute:'compute',bandwidth:'bandwidth',latency:'latency'};q.reflection='measure';assert.equal(latencyDone(q),true);
 const c=latencyRestore(q);c.seen.pop();c.answers.compute=null;assert.equal(q.seen.length,9);assert.equal(q.answers.compute,'compute');assert.equal(latencyDone(c),false);
 assert.throws(()=>latencyRestore({...q,seen:['compute:wait']}));assert.throws(()=>latencyRestore({...q,seen:['compute:compute','compute:compute']}));
});
