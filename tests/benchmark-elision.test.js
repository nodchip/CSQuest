import {test} from 'node:test';
import assert from 'node:assert/strict';
import {benchmarkResult,batchMeasurement,createBenchmark,benchmarkAct,benchmarkComplete,restoreBenchmark} from '../src/benchmark-elision.js';
test('the fixed model omits the computation only for optimized unused results',()=>{
 for(const m of ['plain','optimized'])for(const u of ['discard','consume']){const r=benchmarkResult(m,u),executes=m!=='optimized'||u!=='discard';assert.equal(r.executes,executes);assert.equal(r.total,executes?9:1);assert.equal(r.total,r.work+r.overhead);}
 assert.throws(()=>benchmarkResult('bad','discard'),RangeError);
});
test('batching spreads fixed measurement overhead without changing the assumed per-item work',()=>{
 assert.deepEqual(batchMeasurement(1),{count:1,overhead:2,work:1,total:3,average:3});assert.deepEqual(batchMeasurement(10),{count:10,overhead:2,work:10,total:12,average:1.2});assert.throws(()=>batchMeasurement(0),RangeError);
 let s=createBenchmark();for(const action of ['batch:1','batch:run','batch:10','batch:run','batch:answer:overhead','batch:check']){const r=benchmarkAct(s,action);assert.equal(r.ok,true);s=r.state;}assert.equal(s.batchAnswer,'overhead');assert.equal(s.batchChecked,true);assert.deepEqual(restoreBenchmark(s),s);assert.equal(benchmarkComplete(s),false);
});
test('all observations and a checked explanation are required and history is validated',()=>{
 let s=createBenchmark();for(const action of ['mode:optimized','use:discard','run','answer:elision','check'])s=benchmarkAct(s,action).state;assert.equal(benchmarkComplete(s),false);assert.deepEqual(restoreBenchmark(s),s);assert.throws(()=>restoreBenchmark({history:['mode:bad']}),RangeError);
});
