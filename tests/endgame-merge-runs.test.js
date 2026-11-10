import test from 'node:test';
import assert from 'node:assert/strict';
import { replayMergeRuns } from '../src/endgame-merge-runs.js';
const steps = ['pick:right', 'pick:right', 'pick:left', 'pick:right', 'pick:left'];
const finish = [...steps, 'next'];
test('four distinct labelled items merge in value order while preserving equal-item order', () => {
  const a = replayMergeRuns('first', finish), b = replayMergeRuns('second', finish);
  assert.deepEqual(a.results[0].items, [{id:'B',value:1},{id:'D',value:2},{id:'A',value:3},{id:'C',value:3}]);
  assert.deepEqual(b.results[0].items, [{id:'B',value:1},{id:'D',value:1},{id:'A',value:2},{id:'C',value:2}]);
  assert.equal(a.results[0].comparisons, 5); assert.equal(b.results[0].comparisons, 5);
  assert.equal(a.done, true); assert.equal(b.done, true);
});
test('comparison requires both independent merges and the correct observation', () => {
  const prefix = [...finish, ...finish];
  assert.equal(replayMergeRuns('compare', prefix).done, false);
  assert.equal(replayMergeRuns('compare', [...prefix, 'answer:stable']).done, true);
  assert.equal(replayMergeRuns('compare', [...prefix, 'answer:arbitrary']), null);
  assert.equal(replayMergeRuns('compare', ['answer:stable']), null);
});
test('invalid histories are rejected and reset reproduces the initial state', () => {
  for (const history of [['pick:left'], ['next'], ['reset','next'], [...steps,'reset'], [...finish,'pick:left'], ['pick:LEFT']]) assert.equal(replayMergeRuns('first', history), null);
  assert.deepEqual(replayMergeRuns('first', ['pick:right','reset']).state, replayMergeRuns('first', []).state);
  assert.equal(replayMergeRuns('unknown', []), null);
});
