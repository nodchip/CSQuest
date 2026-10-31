import test from 'node:test';
import assert from 'node:assert/strict';
import { isSorted, sortingLevel, swapAdjacent } from '../src/sorting.js';

test('the original order can be sorted with five adjacent swaps', () => {
  let values = sortingLevel.initial;
  for (const index of [0, 1, 2, 1, 0]) values = swapAdjacent(values, index);
  assert.deepEqual(values, [1, 2, 3, 4]);
  assert.equal(isSorted(values), true);
  assert.deepEqual(sortingLevel.initial, [4, 2, 3, 1]);
});

test('sorting checks every adjacent pair and handles repeated numbers', () => {
  assert.equal(isSorted([1, 2, 2, 4]), true);
  assert.equal(isSorted([1, 3, 2, 4]), false);
});

test('only valid adjacent pairs can be swapped', () => {
  for (const index of [-1, 3, 0.5]) assert.throws(() => swapAdjacent([1, 2, 3, 4], index), RangeError);
});
