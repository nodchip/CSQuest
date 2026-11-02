import test from 'node:test';
import assert from 'node:assert/strict';
import {edgeReplay,edgeCreate,edgeRestore,edgeComplete} from '../src/edge-control.js';
test('the four fixed paths have the specified timing and connectivity',()=>{
 for(const link of ['online','offline']){const r=edgeReplay('local',link,['read','local','act']);assert.equal(r.time,3);assert.equal(r.messages,0);assert.equal(r.decision,'close');assert.equal(r.met,true);}
 const online=edgeReplay('remote','online',['read','send','compute','return','act']);assert.equal(online.time,8);assert.equal(online.messages,2);assert.equal(online.met,false);assert.equal(online.decision,'close');
 const offline=edgeReplay('remote','offline',['read','send']);assert.equal(offline.phase,'unavailable');assert.equal(offline.messages,0);assert.equal(offline.met,false);
 assert.throws(()=>edgeReplay('local','online',['act']));assert.throws(()=>edgeReplay('remote','offline',['read','send','compute']));assert.throws(()=>edgeReplay('remote','online',['read','send','act']));
});
test('partial paths restore and all comparisons and reflections are required',()=>{
 const q=edgeCreate();q.trials.remote.online=['read','send'];assert.deepEqual(edgeRestore(q),q);assert.throws(()=>edgeRestore({...q,trials:{...q.trials,local:{...q.trials.local,online:['act']}}}));
 for(const l of ['online','offline'])q.trials.local[l]=['read','local','act'];q.trials.remote.online=['read','send','compute','return','act'];q.trials.remote.offline=['read','send'];q.timing='conditional';assert.equal(edgeComplete(q),false);q.limits='needs';assert.equal(edgeComplete(q),true);
});
