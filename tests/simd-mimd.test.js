import test from 'node:test';
import assert from 'node:assert/strict';
import {createVectorTrial,stepVector,vectorCorrect,createVectors,vectorsComplete,restoreVectors} from '../src/simd-mimd.js';

test('SIMD shares one operation, MIMD accepts independent operations',()=>{
  let simd=createVectorTrial('mixedSimd');const mixed=['inc','double','inc','double'];assert.equal(stepVector(simd,mixed).history.length,0);simd=stepVector(simd,['inc','skip','inc','skip']);simd=stepVector(simd,['skip','double','skip','double']);assert.deepEqual(simd.values,[2,4,4,8]);assert.ok(vectorCorrect(simd));
  const mimd=stepVector(createVectorTrial('mixedMimd'),mixed);assert.deepEqual(mimd.values,[2,4,4,8]);assert.ok(vectorCorrect(mimd));
});
test('all tasks require the intended operations and saved choices replay',()=>{
  const s=createVectors();s.trials.uniformSimd=stepVector(s.trials.uniformSimd,['inc','inc','inc','inc']);s.trials.uniformMimd=stepVector(s.trials.uniformMimd,['inc','inc','inc','inc']);s.trials.mixedSimd=stepVector(stepVector(s.trials.mixedSimd,['inc','skip','inc','skip']),['skip','double','skip','double']);s.trials.mixedMimd=stepVector(s.trials.mixedMimd,['inc','double','inc','double']);assert.ok(vectorsComplete(s));assert.ok(vectorsComplete(restoreVectors(s)));
  const wrong=stepVector(createVectorTrial('uniformMimd'),['double','inc','inc','inc']);assert.equal(vectorCorrect(wrong),false);
  assert.throws(()=>restoreVectors({...s,trials:{...s.trials,mixedSimd:{...s.trials.mixedSimd,history:[['inc','double','inc','double']]}}}));
});
