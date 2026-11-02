import test from 'node:test';
import assert from 'node:assert/strict';
import {chipletEstimate,chipletCreate,chipletRestore,chipletComplete} from '../src/chiplet-package.js';
test('expected cost includes tested die replacement and discarded failed assemblies',()=>{
 const mono=chipletEstimate('mono',2),side=chipletEstimate('side',2),stack=chipletEstimate('stack',2);
 assert.equal(mono.cost,156.25);assert.equal(side.parts,125);assert.equal(side.attempt,130);assert.ok(Math.abs(side.cost-1300/9)<1e-10);assert.ok(Math.abs(stack.cost-1450/9)<1e-10);assert.ok(side.cost<mono.cost&&mono.cost<stack.cost);
 assert.equal(chipletEstimate('side',1).done,false);assert.throws(()=>chipletEstimate('mono',3));assert.throws(()=>chipletEstimate('missing',0));
});
test('all three comparisons and both reflections are required and drafts validate',()=>{
 const q=chipletCreate();q.stages.side=1;assert.deepEqual(chipletRestore(q),q);assert.throws(()=>chipletRestore({...q,stages:{...q.stages,side:3}}));
 q.stages={mono:2,side:2,stack:2};q.cost='depends';assert.equal(chipletComplete(q),false);q.limits='thermal';assert.equal(chipletComplete(q),true);
});
