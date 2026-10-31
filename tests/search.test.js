import test from 'node:test';
import assert from 'node:assert/strict';
import { createSearch, inspectPlace, routeTo, paths } from '../src/search.js';

test('breadth-first queue explores by distance and reconstructs a shortest path', () => {
  let state=createSearch();
  for (const place of ['S','A','B','C','D','E','F','G']) state=inspectPlace(state,place);
  assert.equal(state.status,'found');
  assert.deepEqual(routeTo(state,'G'),['S','B','E','G']);
  assert.equal(new Set(state.seen).size,state.seen.length);
  const route=routeTo(state,'G');
  for(let i=1;i<route.length;i++) assert.ok(paths[route[i-1]].includes(route[i]));
  assert.ok(!paths.S.includes('G'));
  assert.ok(paths.S.every(neighbor=>!paths[neighbor].includes('G')));
});
test('choosing a later queued place does not change the search state', () => {
  const state=inspectPlace(createSearch(),'S');
  const wrong=inspectPlace(state,'B');
  assert.deepEqual(wrong.queue,['A','B']);
  assert.deepEqual(wrong.explored,['S']);
  assert.match(wrong.message,/先頭/);
});
test('converging roads add an already discovered place only once', () => {
  let state=createSearch();
  for(const place of ['S','A','B']) state=inspectPlace(state,place);
  assert.deepEqual(state.queue,['C','D','E']);
  assert.equal(state.parents.D,'A');
  for(const [from,neighbors] of Object.entries(paths)) for(const to of neighbors) assert.ok(paths[to].includes(from));
  assert.equal(routeTo(state,'G'),null);
});
