import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isolationResult,createIsolation,isolationComplete,restoreIsolation} from '../src/vm-isolation.js';
test('the fixed allocation rules conserve capacity and illustrate the cap tradeoff',()=>{
 assert.deepEqual(isolationResult('shared','idle'),{a:4,b:0});assert.deepEqual(isolationResult('shared','busy'),{a:1,b:3});assert.deepEqual(isolationResult('capped','idle'),{a:2,b:0});assert.deepEqual(isolationResult('capped','busy'),{a:2,b:2});
 for(const m of ['shared','capped'])for(const l of ['idle','busy']){const r=isolationResult(m,l);assert.ok(r.a+r.b<=4);assert.ok(r.b<=(l==='busy'?3:0));}assert.throws(()=>isolationResult('bad','idle'),RangeError);
});
test('all predictions and a checked tradeoff are required, copied and validated',()=>{
 const s=createIsolation();for(const m of ['shared','capped'])for(const l of ['idle','busy'])s.choices[m][l]={a:isolationResult(m,l).a,checked:true};s.answer='tradeoff';assert.equal(isolationComplete(s),false);s.confirmed=true;const copy=restoreIsolation(s);s.choices.shared.busy.a=4;assert.equal(isolationComplete(s),false);assert.equal(isolationComplete(copy),true);assert.throws(()=>restoreIsolation({...copy,answer:'bad'}),RangeError);
});
