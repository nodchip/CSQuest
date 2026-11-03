import test from 'node:test';
import assert from 'node:assert/strict';
import {deepInitial,deepMetrics,deepTrain,deepCreate,deepInspect,deepComplete,deepRestore} from '../src/deep-features.js';

test('two-layer backpropagation agrees with independent central differences for all fifteen parameters',()=>{
 for(const p of [deepInitial,deepTrain(100)]){const {grad}=deepMetrics(p),eps=1e-5;for(let i=0;i<p.length;i++){const a=[...p],b=[...p];a[i]+=eps;b[i]-=eps;assert.ok(Math.abs(grad[i]-(deepMetrics(a).loss-deepMetrics(b).loss)/(2*eps))<1e-8,`parameter ${i}`);}}
});
test('trained network separates the four training examples and exposes both hidden layers',()=>{
 const initial=deepMetrics(deepTrain(0)),trained=deepMetrics(deepTrain(2000));assert.ok(trained.loss<0.01);assert.ok(trained.loss<initial.loss);for(const row of trained.rows){assert.equal(row.output>=0.5,Boolean(row.target));assert.equal(row.first.length,2);assert.equal(row.second.length,2);assert.ok([...row.first,...row.second].every(v=>v>=-1&&v<=1));}assert.throws(()=>deepTrain(1));
});
test('comparisons and reflection are required and restored records are validated and copied',()=>{
 const q=deepCreate();for(const step of [0,1000,2000])for(const layer of ['first','second']){q.step=step;q.layer=layer;deepInspect(q);}assert.equal(deepComplete(q),false);q.reflection='limited';assert.equal(deepComplete(q),true);const copy=deepRestore(q);copy.seen.pop();assert.equal(q.seen.length,6);assert.throws(()=>deepRestore({...q,seen:['0:first','0:first']}));assert.throws(()=>deepRestore({...q,step:3000}));
});
