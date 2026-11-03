import test from 'node:test';
import assert from 'node:assert/strict';
import {majoritySources,majorityReplay,majorityCreate,majorityComplete,majorityRestore} from '../src/memory-majority.js';
test('majority across all four input pairs implements AND with zero and OR with one',()=>{
 for(const [fill,expected] of [['fill-0',[1,0,0,0]],['fill-1',[1,1,1,0]]]){const r=majorityReplay('and',['copy-a','copy-b',fill,'activate','store']);assert.deepEqual(r.result,expected);assert.deepEqual(r.a,expected);assert.deepEqual(r.b,expected);assert.deepEqual(r.c,expected);}
 assert.deepEqual(majoritySources.A,[1,0,1,0]);assert.deepEqual(majoritySources.B,[1,1,0,0]);
});
test('wrong constant can be observed but does not complete; copy order and restoration are checked',()=>{
 const q=majorityCreate();q.runs.and=['copy-b','fill-1','copy-a','activate','store'];assert.equal(majorityReplay('and',q.runs.and).correct,false);q.runs.and=['copy-b','fill-0','copy-a','activate','store'];q.runs.or=['copy-a','copy-b','fill-1','activate','store'];assert.equal(majorityComplete(q),false);q.reflection='limited';assert.equal(majorityComplete(q),true);const copy=majorityRestore(q);copy.runs.and.pop();assert.equal(q.runs.and.length,5);assert.throws(()=>majorityReplay('and',['activate']));assert.throws(()=>majorityReplay('and',['copy-a','copy-a']));assert.throws(()=>majorityRestore({...q,runs:{...q.runs,or:['store']}}));
});
