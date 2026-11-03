import test from 'node:test';
import assert from 'node:assert/strict';
import {darkEvaluate,darkCreate,darkRestore,darkDone,darkRequired} from '../src/dark-silicon.js';
test('all 18 scenarios use active and idle power and the inclusive limit',()=>{
 const power={fast:[40,65,90,115,140,165,190,215,240],slow:[40,55,70,85,100,115,130,145,160]};
 for(const mode of ['fast','slow'])for(let n=0;n<=8;n++){const r=darkEvaluate(mode,n);assert.equal(r.power10,power[mode][n]);assert.equal(r.within,mode==='slow'||n<=5);assert.equal(r.inactive,8-n);assert.equal(r.work10,n*(mode==='fast'?10:6));}
 assert.throws(()=>darkEvaluate('constructor',2));assert.throws(()=>darkEvaluate('fast',9));
});
test('recorded comparisons and both conclusions are required',()=>{
 const q=darkCreate();q.seen=[...darkRequired];q.best='fast5';q.reason='limit';assert.equal(darkDone(q),true);for(const k of darkRequired)assert.equal(darkDone({...q,seen:q.seen.filter(x=>x!==k)}),false);assert.equal(darkDone({...q,best:'slow8'}),false);assert.equal(darkDone({...q,reason:'always'}),false);
 assert.ok(darkEvaluate('fast',5).within);assert.ok(darkEvaluate('slow',8).within);assert.ok(darkEvaluate('fast',5).work10>darkEvaluate('slow',8).work10);
});
test('draft restoration copies valid markers and rejects corrupted input',()=>{
 const q=darkCreate();q.seen=['fast:5'];const r=darkRestore(q);r.seen.push('slow:8');assert.deepEqual(q.seen,['fast:5']);assert.throws(()=>darkRestore({...q,seen:['fast:5','fast:5']}));assert.throws(()=>darkRestore({...q,seen:['constructor:1']}));assert.throws(()=>darkRestore({...q,count:8.5}));
});
