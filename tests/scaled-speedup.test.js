import test from 'node:test';
import assert from 'node:assert/strict';
import {scaledCalculate,scaledKey,scaledCreate,scaledRestore,scaledDone,scaledModes,scaledPreparations,scaledBatches,scaledWorkers} from '../src/scaled-speedup.js';

test('scaled baseline is one worker doing the same enlarged job',()=>{
 assert.deepEqual(scaledCalculate('scaled',2,2,4),{boxes:4,one:10,many:4,speedup:2.5,serialFraction:0.5});
 assert.deepEqual(scaledCalculate('fixed',2,2,4),{boxes:8,one:18,many:6,speedup:3,serialFraction:1/3});
 for(const p of scaledPreparations)for(const b of scaledBatches)for(const n of scaledWorkers){const r=scaledCalculate('scaled',p,b,n);assert.equal(r.one,p+b*n);assert.equal(r.many,p+b);assert.ok(Math.abs(r.speedup-(n-r.serialFraction*(n-1)))<1e-12);}
});
test('all 48 selectable configurations are valid and restoration rejects forged keys',()=>{
 const all=Object.keys(scaledModes).flatMap(m=>scaledPreparations.flatMap(p=>scaledBatches.flatMap(b=>scaledWorkers.map(n=>scaledKey(m,p,b,n)))));assert.equal(new Set(all).size,48);
 const q=scaledCreate();q.seen=['fixed:1:2:1','fixed:1:2:4','fixed:1:2:8','scaled:1:2:1','scaled:1:2:4','scaled:1:2:8','scaled:4:2:4'];q.baseline='same';q.assumption='ideal';assert.equal(scaledDone(q),true);
 const copy=scaledRestore(q);copy.seen.pop();assert.equal(scaledDone(copy),false);assert.equal(q.seen.length,7);assert.throws(()=>scaledRestore({...q,seen:['fixed:01:2:1']}));assert.throws(()=>scaledRestore({...q,seen:[all[0],all[0]]}));assert.throws(()=>scaledCalculate('scaled',1,2,3));
});
