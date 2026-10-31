import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seedSequence,createEntropy,entropyComplete,restoreEntropy} from '../src/entropy-seed.js';
test('the toy deterministic generator repeats from the same seed',()=>{
 assert.deepEqual(seedSequence(3),[0,1,6,15,12]);assert.deepEqual(seedSequence(7),[4,5,10,3,0]);assert.deepEqual(seedSequence(3),seedSequence(3));assert.throws(()=>seedSequence(4),RangeError);
});
test('repeated and different seed trials and both checked conclusions are needed',()=>{
 const s=createEntropy();s.history=[3,3,7];s.prediction='same';s.source='physical';s.checked=true;const copy=restoreEntropy(s);assert.equal(entropyComplete(copy),true);s.history.pop();assert.equal(entropyComplete(s),false);copy.source='rule';assert.equal(entropyComplete(copy),false);assert.throws(()=>restoreEntropy({...s,history:[4]}),RangeError);
});
