import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreForest,restoreRoads,restoreSchedules} from '../src/drafts.js';

test('partial exploration and weighted route can be reconstructed',()=>{
  const forest=restoreForest(['S','A']);
  assert.deepEqual(forest.explored,['S','A']);assert.deepEqual(forest.queue,['B','C','D']);
  const roads=restoreRoads(['S','B']);
  assert.equal(roads.distances.A,2);assert.deepEqual(roads.settled,['S','B']);
});
test('two scheduling histories resume independently',()=>{
  const {states,selected}=restoreSchedules({selected:'rr',fcfs:['A','A','A'],rr:['A','B']});
  assert.equal(selected,'rr');assert.equal(states.fcfs.time,3);assert.equal(states.rr.time,2);
  assert.deepEqual(states.rr.queue,['C','A','B']);
});
test('malformed or impossible saved actions are rejected',()=>{
  assert.throws(()=>restoreForest(['S','B']),RangeError);
  assert.throws(()=>restoreRoads(['S','A']),RangeError);
  assert.throws(()=>restoreSchedules({selected:'rr',fcfs:['B'],rr:[]}),RangeError);
  assert.throws(()=>restoreForest(['<img>']),RangeError);
  assert.throws(()=>restoreRoads(Array(5).fill('S')),RangeError);
});
