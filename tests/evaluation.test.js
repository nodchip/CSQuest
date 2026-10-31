import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateRows,evaluateSet,heldOut} from '../src/evaluation.js';

test('training records match themselves but held-out results contain an error',()=>{
  const known=evaluateSet('known'), testSet=evaluateSet('heldout');
  assert.equal(known.correct,3);assert.equal(known.total,3);
  assert.equal(testSet.correct,2);assert.equal(testSet.total,3);
  assert.deepEqual(testSet.rows.map(row=>row.neighbor),['A','B','C']);
  assert.deepEqual(testSet.rows.map(row=>row.correct),[true,true,false]);
});
test('changing the ground truth does not change the predicted label',()=>{
  const before=evaluateRows([heldOut[2]]).rows[0];
  const after=evaluateRows([{...heldOut[2],label:'青の水晶'}]).rows[0];
  assert.equal(before.predicted,after.predicted);
  assert.equal(before.correct,false);assert.equal(after.correct,true);
});
test('unsupported sets and ambiguous ties are rejected',()=>{
  assert.throws(()=>evaluateSet('unknown'),RangeError);
  assert.throws(()=>evaluateRows([{id:'x',brightness:2,warmth:0,label:'赤の水晶'}],[{id:'a',brightness:1,warmth:0,label:'赤の水晶'},{id:'b',brightness:3,warmth:0,label:'青の水晶'}]),RangeError);
});
