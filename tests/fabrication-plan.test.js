import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fabricationEstimate, fabricationPlanCreate, fabricationPlanCheck, fabricationPlanRestore, fabricationExecutionResult, fabricationExecutionCheck} from '../src/fabrication-plan.js';

test('setup and per-item costs and times change the comparison with quantity', () => {
  assert.deepEqual(fabricationEstimate('add', 1), {cost: 7, minutes: 25});
  assert.deepEqual(fabricationEstimate('cut', 1), {cost: 14, minutes: 38});
  assert.deepEqual(fabricationEstimate('add', 10), {cost: 34, minutes: 160});
  assert.deepEqual(fabricationEstimate('cut', 10), {cost: 32, minutes: 110});
  assert.throws(() => fabricationEstimate('toString', 1));
  assert.throws(() => fabricationEstimate('add', 0));
});

test('actual results include the reason for the deviation and only correct differences are recorded', () => {
  const p=fabricationPlanCreate(), x=p.execution;
  assert.deepEqual(fabricationExecutionResult('retry'),{planned:{cost:7,minutes:25},actual:{cost:10,minutes:40}});
  assert.equal(fabricationExecutionCheck(x,10,40),false);
  assert.equal(fabricationExecutionCheck(x,3,15),true);
  x.selected='setup';
  assert.deepEqual(fabricationExecutionResult('setup'),{planned:{cost:32,minutes:110},actual:{cost:38,minutes:130}});
  assert.equal(fabricationExecutionCheck(x,6,20),true);
  assert.deepEqual(fabricationPlanRestore(p),p);
  assert.throws(()=>fabricationPlanRestore({...p,execution:{selected:'setup',checked:['retry','retry']}}));
  const old={method:'add',quantity:1,checked:[]};
  assert.deepEqual(fabricationPlanRestore(old).execution,{selected:'retry',checked:[]});
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
