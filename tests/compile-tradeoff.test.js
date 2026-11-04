import test from 'node:test';
import assert from 'node:assert/strict';
import {tradeoffModes,tradeoffEvaluate,tradeoffAudit,tradeoffTotals,tradeoffCreate,tradeoffCheck,tradeoffDone,tradeoffRestore} from '../src/compile-tradeoff.js';
test('two strategies preserve the required results, while a short candidate fails after zero',()=>{
 for(const x of [0,1,2,3]){assert.equal(tradeoffEvaluate('quick',x),4*x);assert.equal(tradeoffEvaluate('optimized',x),4*x);}
 assert.equal(tradeoffEvaluate('broken',0),0);assert.notEqual(tradeoffEvaluate('broken',1),4);assert.equal(tradeoffAudit('broken').correct,false);
 for(const k of ['quick','optimized'])assert.equal(tradeoffAudit(k).correct,true);assert.throws(()=>tradeoffEvaluate('quick',4),RangeError);
});
test('costs include compilation, reveal break-even, and completion restores independently',()=>{
 assert.deepEqual([1,2,5].map(n=>tradeoffTotals(n).winner),['quick','equal','optimized']);
 const q=tradeoffCreate();q.audited=Object.keys(tradeoffModes);q.answer='equal';assert.equal(tradeoffCheck(q).correct,false);
 for(const [n,answer] of [[1,'quick'],[2,'equal'],[5,'optimized']]){q.runs=n;q.answer=answer;assert.equal(tradeoffCheck(q).correct,true);}
 assert.equal(tradeoffDone(q),false);q.reflection='scope';assert.equal(tradeoffDone(tradeoffRestore(q)),true);
 const copy=tradeoffRestore(q);copy.seen.pop();assert.equal(q.seen.length,3);assert.throws(()=>tradeoffRestore({...q,audited:['quick','quick']}),RangeError);
});
