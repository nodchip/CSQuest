import test from 'node:test';
import assert from 'node:assert/strict';
import {createHeapTrial,heapExpected,stepHeap,createHeapSet,heapComplete,restoreHeapSet} from '../src/min-heap.js';

test('insertion rises and extraction replaces the root and sinks through the smaller child',()=>{
  const all=createHeapSet();for(const [id,actions,expected] of [['insert',['begin','swap:2','swap:0','finish'],[1,5,2,9,7,6,4]],['extract',['begin','swap:2','swap:5','finish'],[2,3,4,7,6,5]]]){let s=createHeapTrial(id);for(const action of actions)s=stepHeap(s,action);assert.deepEqual(s.heap,expected);assert.equal(s.phase,'done');for(let i=1;i<s.heap.length;i++)assert.ok(s.heap[Math.floor((i-1)/2)]<=s.heap[i]);if(id==='extract')assert.equal(s.removed,1);all.trials[id]=s;}assert.ok(heapComplete(all));
});
test('incorrect swaps do not advance and saved actions are replayed',()=>{
  let s=stepHeap(createHeapTrial('extract'),'begin');assert.equal(heapExpected(s),2);assert.equal(stepHeap(s,'swap:1').history.length,s.history.length);
  const histories={insert:['begin','swap:2'],extract:[]};s=restoreHeapSet({selected:'insert',histories}).trials.insert;assert.equal(s.focus,2);assert.equal(heapExpected(s),0);
  assert.throws(()=>restoreHeapSet({selected:'insert',histories:{...histories,insert:['begin','swap:0']}}));
});
