import test from 'node:test';
import assert from 'node:assert/strict';
import {pairedStats,pairedCreate,pairedRestore,pairedDone} from '../src/paired-benchmark.js';
test('paired differences use sample standard deviation and t interval',()=>{
 const a=pairedStats('steady',5),b=pairedStats('variable',5);
 assert.deepEqual(a.pairs.map(x=>x.diff),[3,4,2,3,3]);assert.equal(a.mean,3);assert.ok(Math.abs(a.sd-Math.sqrt(.5))<1e-12);assert.ok(Math.abs(a.low-2.122)<.001);assert.ok(Math.abs(a.high-3.878)<.001);
 assert.deepEqual(b.pairs.map(x=>x.diff),[2,3,-1,3,2]);assert.equal(b.mean,1.8);assert.ok(b.low<0&&b.high>0);assert.ok(Math.abs(b.sd-Math.sqrt(2.7))<1e-12);
 assert.equal(pairedStats('steady',1).low,null);assert.throws(()=>pairedStats('steady',6));
});
test('each record and both reflections are required and drafts are copied and checked',()=>{
 const q=pairedCreate();q.counts={steady:5,variable:5};q.interpretation='uncertain';q.design='repeat';assert.equal(pairedDone(q),true);
 const copy=pairedRestore(q);copy.counts.steady=4;assert.equal(q.counts.steady,5);assert.equal(pairedDone(copy),false);assert.throws(()=>pairedRestore({...q,counts:{steady:-1,variable:5}}));
});
