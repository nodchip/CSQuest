import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fabricationEstimate, fabricationPlanCreate, fabricationPlanCheck, fabricationPlanRestore} from '../src/fabrication-plan.js';

test('setup and per-item costs and times change the comparison with quantity', () => {
  assert.deepEqual(fabricationEstimate('add', 1), {cost: 7, minutes: 25});
  assert.deepEqual(fabricationEstimate('cut', 1), {cost: 14, minutes: 38});
  assert.deepEqual(fabricationEstimate('add', 10), {cost: 34, minutes: 160});
  assert.deepEqual(fabricationEstimate('cut', 10), {cost: 32, minutes: 110});
  assert.throws(() => fabricationEstimate('toString', 1));
  assert.throws(() => fabricationEstimate('add', 0));
});

test('only correct estimates are recorded and restored independently', () => {
  const p = fabricationPlanCreate();
  assert.equal(fabricationPlanCheck(p, 7, 26), false);
  assert.deepEqual(p.checked, []);
  assert.equal(fabricationPlanCheck(p, 7, 25), true);
  assert.equal(fabricationPlanCheck(p, 7, 25), true);
  p.method = 'cut'; p.quantity = 10;
  assert.equal(fabricationPlanCheck(p, 32, 110), true);
  const restored = fabricationPlanRestore(p);
  assert.deepEqual(restored, p);
  restored.checked.pop();
  assert.equal(p.checked.length, 2);
  assert.throws(() => fabricationPlanRestore({...p, checked: ['add:1', 'add:1']}));
  assert.throws(() => fabricationPlanRestore({...p, checked: ['cut:2']}));
});
