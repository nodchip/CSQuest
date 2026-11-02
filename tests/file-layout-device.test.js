import test from 'node:test';
import assert from 'node:assert/strict';
import {fileLayouts,fileLayoutCases,fileLayoutTrace,fileLayoutCreate,fileLayoutCheck,fileLayoutComplete,fileLayoutRestore} from '../src/file-layout-device.js';

test('independent expected locations, distances and model totals for all four cases',()=>{
 const expected={'disk:compact':[[0,1,2,3],[0,1,1,1],[1,2,2,2],7],'disk:scattered':[[0,9,2,8],[0,9,7,6],[1,10,8,7],26],'flash:compact':[[0,1,2,3],[0,1,1,1],[1,1,1,1],4],'flash:scattered':[[0,9,2,8],[0,9,7,6],[1,1,1,1],4]};
 for(const [key,[order,distances,increments,total]] of Object.entries(expected)){const t=fileLayoutTrace(key,order);assert.deepEqual(t.steps.map(x=>x.distance),distances);assert.deepEqual(t.steps.map(x=>x.increment),increments);assert.equal(t.cost,total);}
 assert.throws(()=>fileLayoutTrace('disk:scattered',[0,2]),RangeError);assert.throws(()=>fileLayoutTrace('disk:bad',[]),RangeError);
});
test('all four correct checks and reflection are required, and saved orders are validated',()=>{
 const q=fileLayoutCreate();assert.throws(()=>fileLayoutCheck(q),RangeError);q.trials[q.selected].order=[0,1,2,3];q.trials[q.selected].guess=4;assert.equal(fileLayoutCheck(q),false);assert.equal(fileLayoutComplete(q),false);
 for(const key of fileLayoutCases){q.selected=key;const [device,layout]=key.split(':');q.trials[key].order=[...fileLayouts[layout].positions];q.trials[key].guess=device==='flash'?4:layout==='compact'?7:26;assert.equal(fileLayoutCheck(q),true);}
 assert.equal(fileLayoutComplete(q),false);q.reflection='conditional';assert.equal(fileLayoutComplete(q),true);const copy=fileLayoutRestore(q);copy.trials['disk:compact'].order.pop();assert.equal(q.trials['disk:compact'].order.length,4);assert.throws(()=>fileLayoutRestore({...q,trials:{...q.trials,'disk:compact':{...q.trials['disk:compact'],order:[2]}}}),RangeError);
});
