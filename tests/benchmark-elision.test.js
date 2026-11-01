import {test} from 'node:test';
import assert from 'node:assert/strict';
import {benchmarkResult,createBenchmark,benchmarkAct,benchmarkComplete,restoreBenchmark} from '../src/benchmark-elision.js';
test('the fixed model omits the computation only for optimized unused results',()=>{
 for(const m of ['plain','optimized'])for(const u of ['discard','consume']){const r=benchmarkResult(m,u),executes=m!=='optimized'||u!=='discard';assert.equal(r.executes,executes);assert.equal(r.total,executes?9:1);assert.equal(r.total,r.work+r.overhead);}
 assert.throws(()=>benchmarkResult('bad','discard'),RangeError);
});
test('all observations and a checked explanation are required and history is validated',()=>{
 let s=createBenchmark();for(const action of ['mode:optimized','use:discard','run','answer:elision','check'])s=benchmarkAct(s,action).state;assert.equal(benchmarkComplete(s),false);assert.deepEqual(restoreBenchmark(s),s);assert.throws(()=>restoreBenchmark({history:['mode:bad']}),RangeError);
});
