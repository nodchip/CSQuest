import test from 'node:test';
import assert from 'node:assert/strict';
import {effectResult,effectCreate,effectRestore} from '../src/paired-effect-lab.js';
import {createPairedPermutation,restorePairedPermutation} from '../src/paired-permutation.js';
test('standardized paired effect is mean over sample standard deviation and scale invariant',()=>{for(const id of ['close','wide']){const a=effectResult(id,'1'),b=effectResult(id,'2');assert.equal(a.mean,5);assert.equal(b.mean,10);assert.equal(b.sd,2*a.sd);assert.equal(a.d,b.d);assert.equal(a.t,b.t);assert.ok(Math.abs(a.t-a.d*2)<1e-12);}assert.ok(Math.abs(effectResult('close','1').d-Math.sqrt(7.5))<1e-12);assert.ok(Math.abs(effectResult('wide','1').d-Math.sqrt(5/12))<1e-12);assert.throws(()=>effectResult('close','bad'));});
test('older records gain independent effect observations',()=>{const q=createPairedPermutation();delete q.effectLab;assert.deepEqual(restorePairedPermutation(q).effectLab,effectCreate());const s=effectCreate();s.seen.push('close:1');const copy=effectRestore(s);copy.seen.pop();assert.equal(s.seen.length,1);assert.throws(()=>effectRestore({...s,seen:['wrong']}));});
