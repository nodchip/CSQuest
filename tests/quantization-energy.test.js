import test from 'node:test';
import assert from 'node:assert/strict';
import {quantEvaluate,quantEnergy,quantCreate,quantRestore,quantDone,quantKeys} from '../src/quantization-energy.js';
test('all scales and inputs have independently calculated quantized and reconstructed values',()=>{
 const expected={half:[[-140,-128,-64,6,true],[-2,-2,-1,0.2,false],[2,2,1,0.2,false],[140,127,63.5,6.5,true],[-1,-1,-0.5,0.25,false],[1,1,0.5,0.25,false]],one:[[-70,-70,-70,0,false],[-1,-1,-1,0.2,false],[1,1,1,0.2,false],[70,70,70,0,false],[0,0,0,0.25,false],[0,0,0,0.25,false]]};
 for(const [s,rows] of Object.entries(expected))for(const [i,e] of rows.entries()){const r=quantEvaluate(s,i);assert.equal(r.rounded,e[0]);assert.equal(r.encoded,e[1]);assert.equal(r.reconstructed,e[2]);assert.ok(Math.abs(r.error-e[3])<1e-10);assert.equal(r.clipped,e[4]);}
 assert.throws(()=>quantEvaluate('constructor',0));assert.throws(()=>quantEvaluate('half',6));
});
test('model costs include conversion and can reverse which option is smaller',()=>{assert.deepEqual(quantEnergy(1),{fp32:4,int8:2});assert.deepEqual(quantEnergy(4),{fp32:4,int8:5});assert.throws(()=>quantEnergy(2));});
test('completion requires all examples, cost cases and limitations; drafts are checked and copied',()=>{
 const q=quantCreate();q.seen=[...quantKeys];q.energySeen=[1,4];q.clip='range';q.limits='measure';assert.equal(quantDone(q),true);
 for(const k of quantKeys)assert.equal(quantDone({...q,seen:q.seen.filter(x=>x!==k)}),false);for(const n of [1,4])assert.equal(quantDone({...q,energySeen:q.energySeen.filter(x=>x!==n)}),false);assert.equal(quantDone({...q,limits:'guarantee'}),false);assert.equal(quantDone({...q,clip:'exact'}),false);
 const r=quantRestore(q);r.seen.pop();r.energySeen.pop();assert.equal(q.seen.length,12);assert.equal(q.energySeen.length,2);assert.throws(()=>quantRestore({...q,seen:['half:0','half:0']}));assert.throws(()=>quantRestore({...q,guess:128}));
});
