import test from 'node:test';
import assert from 'node:assert/strict';
import {sharedTrace,sharedCreate,sharedCheck,sharedDone,sharedRestore,sharedRequired} from '../src/shared-space.js';
test('reaction and braking include the human approach through the final stopping tick',()=>{
 assert.deepEqual(sharedTrace(4,1).rows.map(r=>r.gap),[2,1]);
 assert.deepEqual(sharedTrace(4,2).rows.map(r=>r.gap),[1,-1,-2]);
 assert.deepEqual(sharedTrace(6,2).rows.map(r=>r.gap),[3,1,0]);
 assert.deepEqual(sharedTrace(7,2).rows.map(r=>r.gap),[4,2,1]);
 assert.equal(sharedTrace(6,2).collision,true);
 assert.equal(sharedTrace(7,2).collision,false);
 assert.throws(()=>sharedTrace(4,0),RangeError);
});
test('wrong predictions do not count; required scenarios and reflection survive restore',()=>{
 let q=sharedCreate();assert.equal(sharedCheck(q),null);q.guess='contact';assert.equal(sharedCheck(q).ok,false);assert.deepEqual(q.seen,[]);
 for(const key of sharedRequired){[q.distance,q.speed]=key.split(':').map(Number);q.guess=key==='4:2'||key==='6:2'?'contact':'clear';assert.equal(sharedCheck(q).ok,true);}
 assert.equal(sharedDone(q),false);q.reflection='limits';q=sharedRestore(q);assert.equal(sharedDone(q),true);assert.throws(()=>sharedRestore({...q,seen:['4:3']}),RangeError);
});
