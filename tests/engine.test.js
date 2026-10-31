import test from 'node:test';
import assert from 'node:assert/strict';
import { levels, run, runScenarios, restoreWorkshop } from '../src/engine.js';

test('each workshop quest can be solved through its intended concept', () => {
  assert.equal(run(levels[0], ['forward','forward']).success, true);
  assert.equal(run(levels[1], ['forward','ifWall','forward']).success, true);
  assert.equal(run(levels[2], ['twice','right','twice']).success, true);
});
test('walls block movement, but later instructions still run', () => {
  const result = run(levels[1], ['forward','forward','ifWall','forward']);
  assert.equal(result.success, true);
  assert.match(result.trace[2].message, /壁/);
});
test('conditional does nothing when there is no wall', () => {
  const result = run(levels[1], ['ifWall','forward']);
  assert.equal(result.trace[1].direction, 1);
  assert.equal(result.trace[2].x, 1);
  assert.equal(result.success, false);
});
test('repeat moves twice and respects walls on each step', () => {
  const result = run(levels[2], ['twice','twice']);
  assert.equal(result.trace.length, 5);
  assert.equal(result.trace[4].x, 2);
  assert.equal(result.success, false);
});
test('rejects commands not available in a quest', () => {
  assert.throws(() => run(levels[0], ['twice']));
});
test('a conditional solves both routes, unlike a fixed turn', () => {
  const level = levels.find(item => item.id === 'two-paths');
  const flexible = runScenarios(level, ['forward', 'ifWall', 'forward']);
  assert.equal(flexible.success, true);
  assert.deepEqual(flexible.cases.map(item => item.success), [true, true]);
  const fixed = runScenarios(level, ['forward', 'right', 'forward']);
  assert.equal(fixed.success, false);
  assert.deepEqual(fixed.cases.map(item => item.success), [true, false]);
});
test('workshop drafts reconstruct the selected scenario and recompute trial results',()=>{
  const level=levels[3];
  const restored=restoreWorkshop(level,{program:['forward','right','forward'],scenario:1,executed:true});
  assert.equal(restored.scenario,1);
  assert.deepEqual(restored.result.cases.map(item=>item.success),[true,false]);
  const pending=restoreWorkshop(level,{program:['forward'],scenario:0,executed:false});
  assert.equal(pending.result,null);
  for(const bad of [
    {program:['twice'],scenario:0,executed:false},
    {program:['forward','forward','forward','forward'],scenario:0,executed:false},
    {program:['forward'],scenario:2,executed:false},
    {program:[],scenario:0,executed:true},
    {program:['forward'],scenario:0,executed:'yes'}
  ]) assert.throws(()=>restoreWorkshop(level,bad),RangeError);
});
