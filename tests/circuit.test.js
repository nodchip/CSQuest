import test from 'node:test';
import assert from 'node:assert/strict';
import { gate, evaluateCircuit, restoreCircuit } from '../src/circuit.js';

test('AND, OR and NAND match all input combinations', () => {
  const pairs = [[0,0], [0,1], [1,0], [1,1]];
  assert.deepEqual(pairs.map(([a,b]) => gate('AND',a,b)), [0,0,0,1]);
  assert.deepEqual(pairs.map(([a,b]) => gate('OR',a,b)), [0,1,1,1]);
  assert.deepEqual(pairs.map(([a,b]) => gate('NAND',a,b)), [1,1,1,0]);
});

test('OR and NAND together meet the one-light condition for all inputs', () => {
  const rows = evaluateCircuit('OR','NAND');
  assert.deepEqual(rows.map(row => row.actual), [0,1,1,0]);
  assert.ok(rows.every(row => row.correct));
  assert.ok(!evaluateCircuit('OR','OR').every(row => row.correct));
});

test('invalid gates or signal values are rejected', () => {
  assert.throws(() => gate('NOT_A_GATE',0,0), RangeError);
  assert.throws(() => gate('AND',2,1), TypeError);
});
test('saved circuit results are recomputed from the selected gates',()=>{
  const saved={parts:['OR','AND'],tested:true},restored=restoreCircuit(saved);
  assert.equal(restored.rows.some(row=>!row.correct),true);saved.parts[0]='NAND';assert.equal(restored.parts[0],'OR');
  assert.equal(restoreCircuit({parts:['OR','NAND'],tested:false}).rows,null);
  assert.throws(()=>restoreCircuit({parts:['OR','bad'],tested:true}),RangeError);
  assert.throws(()=>restoreCircuit({parts:['OR','NAND'],tested:'yes'}),RangeError);
});
