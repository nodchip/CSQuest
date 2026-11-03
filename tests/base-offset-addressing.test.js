import test from 'node:test';
import assert from 'node:assert/strict';
import {baseChoices,offsetChoices,baseOffsetResult,baseOffsetCreate,baseOffsetRestore,baseOffsetDone,baseRequired} from '../src/base-offset-addressing.js';
test('all 24 base and byte-offset choices give the expected address and classification',()=>{
 const expected={100:[['unmapped',null],['value',11],['unaligned',null],['value',22],['value',33],['unmapped',null]],104:[['value',11],['value',22],['unaligned',null],['value',33],['unmapped',null],['unmapped',null]],200:[['unmapped',null],['value',44],['unaligned',null],['value',55],['value',66],['unmapped',null]],204:[['value',44],['value',55],['unaligned',null],['value',66],['unmapped',null],['unmapped',null]]};
 for(const b of baseChoices)for(const [i,o] of offsetChoices.entries()){const r=baseOffsetResult(b,o);assert.equal(r.address,b+o);assert.deepEqual([r.kind,r.value],expected[b][i]);}
 assert.throws(()=>baseOffsetResult(99,0));assert.throws(()=>baseOffsetResult(100,1));
});
test('six comparisons and both limits must be completed',()=>{
 const q=baseOffsetCreate();q.seen=[...baseRequired];q.reflection='byte';q.alignment='model';assert.equal(baseOffsetDone(q),true);for(const key of baseRequired)assert.equal(baseOffsetDone({...q,seen:q.seen.filter(x=>x!==key)}),false);assert.equal(baseOffsetDone({...q,reflection:'element'}),false);assert.equal(baseOffsetDone({...q,alignment:'always'}),false);
});
test('restoration copies valid observations and rejects corrupted fields',()=>{
 const q=baseOffsetCreate();q.seen=['100:4'];const r=baseOffsetRestore(q);r.seen.push('200:4');assert.deepEqual(q.seen,['100:4']);assert.throws(()=>baseOffsetRestore({...q,seen:['100:4','100:4']}));assert.throws(()=>baseOffsetRestore({...q,seen:['100:1']}));assert.throws(()=>baseOffsetRestore({...q,base:101}));
});
