import test from 'node:test';
import assert from 'node:assert/strict';
import { createRouteSearch, settlePlace, reconstructRoute, roads } from '../src/routes.js';

test('shorter indirect route updates an earlier estimate and is selected', () => {
  let state=createRouteSearch();
  state=settlePlace(state,'S');
  assert.equal(state.distances.A,5);
  state=settlePlace(state,'B');
  assert.equal(state.distances.A,2);
  state=settlePlace(state,'A');
  assert.equal(state.distances.G,4);
  state=settlePlace(state,'G');
  assert.equal(state.status,'found');
  const path=reconstructRoute(state,'G');
  assert.deepEqual(path,['S','B','A','G']);
  assert.equal(path.slice(1).reduce((sum,id,i)=>sum+roads[path[i]][id],0),4);
  assert.equal(roads.S.A+roads.A.G,7);
});
test('a nonminimum choice preserves distances and settled places', () => {
  const initial=settlePlace(createRouteSearch(),'S');
  const wrong=settlePlace(initial,'A');
  assert.deepEqual(wrong.distances,initial.distances);
  assert.deepEqual(wrong.settled,['S']);
  assert.match(wrong.message,/小さい/);
});
test('roads have positive weights and are symmetric', () => {
  for (const [from,neighbors] of Object.entries(roads)) for (const [to,weight] of Object.entries(neighbors)) {
    assert.ok(weight>0);assert.equal(roads[to][from],weight);
  }
  assert.throws(()=>settlePlace(createRouteSearch(),'G'),RangeError);
});
