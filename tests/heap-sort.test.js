import test from 'node:test';
import assert from 'node:assert/strict';
import {heapSortInitial,createHeapSort,heapSortExpected,stepHeapSort,restoreHeapSort} from '../src/heap-sort.js';

test('heap construction and repeated extraction produce a sorted permutation',()=>{
  let s=createHeapSort(),steps=0;while(s.phase!=='done'&&steps++<50){if(s.phase==='extract'){for(let i=1;i<s.active;i++)assert.ok(s.values[Math.floor((i-1)/2)]>=s.values[i]);const suffix=s.values.slice(s.active);assert.deepEqual(suffix,suffix.slice().sort((a,b)=>a-b));s=stepHeapSort(s,'extract');}else{const target=heapSortExpected(s);s=stepHeapSort(s,target===null?'settle':`swap:${target}`);}}
  assert.equal(s.phase,'done');assert.deepEqual(s.values,heapSortInitial.slice().sort((a,b)=>a-b));assert.equal(s.active,1);
});
test('unready settlement and invalid swaps do not advance; histories replay',()=>{
  let s=createHeapSort();s=stepHeapSort(s,'settle');assert.equal(s.focus,1);assert.equal(heapSortExpected(s),4);assert.equal(stepHeapSort(s,'settle').history.length,s.history.length);assert.equal(stepHeapSort(s,'swap:3').history.length,s.history.length);
  const restored=restoreHeapSort({history:['settle','swap:4']});assert.equal(restored.focus,4);assert.throws(()=>restoreHeapSort({history:['settle','settle']}));
});
