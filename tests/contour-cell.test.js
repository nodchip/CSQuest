import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contourCrossings, contourCreate, contourSetMask, contourToggleEdge, contourCheck, contourCorrect, contourRestore} from '../src/contour-cell.js';

test('all 16 corner patterns produce exactly the edges with opposite signs', () => {
  const expected = [[],[0,3],[0,1],[1,3],[1,2],[0,1,2,3],[0,2],[2,3],[2,3],[0,2],[0,1,2,3],[1,2],[1,3],[0,1],[0,3],[]];
  for (let mask=0; mask<16; mask++) assert.deepEqual(contourCrossings(mask),expected[mask]);
  assert.throws(()=>contourCrossings(16));
});

test('wrong and right answers, empty boundary, retries and copied restored state', () => {
  const s=contourCreate();
  assert.equal(contourCheck(s),false);
  contourToggleEdge(s,0);contourToggleEdge(s,3);
  assert.equal(contourCheck(s),true);assert.equal(contourCorrect(s),true);
  contourSetMask(s,0);assert.equal(contourCheck(s),true);
  contourSetMask(s,5);for(const e of [0,1,2,3])contourToggleEdge(s,e);
  assert.equal(contourCheck(s),true);
  const restored=contourRestore(s);assert.deepEqual(restored,s);
  restored.checked.pop();assert.equal(s.checked.length,3);
  assert.throws(()=>contourRestore({...s,selected:[0,0]}));
  assert.throws(()=>contourRestore({...s,checked:[16]}));
});
