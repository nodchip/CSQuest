import test from 'node:test';
import assert from 'node:assert/strict';
import {quantumTransmission,quantumSample,siftedIndices,createQuantumKey,quantumKeyComplete,restoreQuantumKey} from '../src/quantum-key.js';
test('same bases recover sent states; interception and mismatched measurements follow the fixed outcomes',()=>{
 assert.deepEqual(siftedIndices,[0,2,3,5]);
 const clean=quantumTransmission(false),attacked=quantumTransmission(true);
 assert.deepEqual(clean.map(r=>r.bobBit),[0,0,1,0,1,0]);
 assert.deepEqual(attacked.map(r=>r.eveBit),[1,0,0,0,1,0]);
 assert.deepEqual(attacked.map(r=>r.bobBit),[1,0,0,0,1,0]);
 assert.equal(clean.filter(r=>r.kept&&r.aliceBit!==r.bobBit).length,0);
 assert.deepEqual(attacked.filter(r=>r.kept&&r.aliceBit!==r.bobBit).map(r=>r.number),[1,3]);
});
test('all six two-bit samples expose or miss the same two errors correctly',()=>{
 for(let a=0;a<4;a++)for(let b=a+1;b<4;b++){
  const sample=[siftedIndices[a],siftedIndices[b]];
  const clean=quantumSample(false,sample),attacked=quantumSample(true,sample);
  assert.equal(clean.errors.length,0);assert.equal(clean.remainingErrors.length,0);
  assert.equal(attacked.errors.length+attacked.remainingErrors.length,2);
 }
 assert.equal(quantumSample(true,[0,2]).errors.length,2);
 assert.equal(quantumSample(true,[3,5]).errors.length,0);
 assert.throws(()=>quantumSample(true,[0,1]));
});
test('progress requires sifting, all observations, and reflection; invalid saved records fail',()=>{
 const s=createQuantumKey();s.selected=[...siftedIndices];s.siftChecked=true;s.tested=['clean','detected','hidden'];s.answer='sample';s.checked=true;
 assert.equal(quantumKeyComplete(restoreQuantumKey(s)),true);
 assert.throws(()=>restoreQuantumKey({...s,selected:[0]}));
 assert.throws(()=>restoreQuantumKey({...s,sample:[0,0]}));
});
