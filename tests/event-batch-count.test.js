import test from 'node:test';import assert from 'node:assert/strict';
import {eventBatchCreate,eventBatchAct,eventBatchReplay,eventBatchDone,eventBatchRestore} from '../src/event-batch-count.js';
test('shared and local counting differ in intermediate visibility and common writes',()=>{
 const q=eventBatchCreate(),act=a=>eventBatchAct(q,a);for(let i=0;i<3;i++)act('receive');act('read');for(let i=0;i<3;i++)act('receive');act('read');let shared=eventBatchReplay('shared',q.runs.shared);assert.deepEqual([shared.mid,shared.final,shared.writes],[3,6,6]);
 q.mode='local';for(let i=0;i<3;i++)act('receive');act('read');for(let i=0;i<3;i++)act('receive');act('read');assert.equal(eventBatchDone(q),false);act('flush:A');act('flush:B');act('read');let local=eventBatchReplay('local',q.runs.local);assert.deepEqual([local.mid,local.final,local.writes],[0,6,2]);q.answer='tradeoff';q.checked=true;assert.equal(eventBatchDone(q),true);
 const copy=eventBatchRestore(q);copy.runs.local.pop();assert.notEqual(copy.runs.local.length,q.runs.local.length);assert.throws(()=>act('receive'),RangeError);
});
test('cannot aggregate empty subtotals or accept invalid actions',()=>{assert.throws(()=>eventBatchReplay('local',['flush:A']),RangeError);assert.throws(()=>eventBatchReplay('shared',['flush:A']),RangeError);assert.throws(()=>eventBatchRestore({mode:'shared',runs:{shared:['bad'],local:[]},answer:null,checked:false}),RangeError);});
