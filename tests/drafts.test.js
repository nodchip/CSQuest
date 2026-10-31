import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreForest,restoreRoads,restoreSchedules,restoreBattle,restoreDelivery,restoreConcurrency,restoreLocking} from '../src/drafts.js';

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

test('battle and delivery resume without skipping their rules',()=>{
  const battle=restoreBattle(['guard','attack']);
  assert.equal(battle.guardianHealth,1);assert.equal(battle.turn,2);
  const delivery=restoreDelivery(['send','retry','send']);
  assert.equal(delivery.phase,'waiting');assert.deepEqual(delivery.received,[0,1]);
  assert.throws(()=>restoreBattle(['attack','guard','attack','attack']));
  assert.throws(()=>restoreDelivery(['send','send']),RangeError);
});
test('concurrent trials restore previous outcomes and current work',()=>{
  const restored=restoreConcurrency({past:[['A','B','A','B']],current:['A','A']});
  assert.deepEqual(restored.state.observed,[1]);assert.equal(restored.state.value,1);
  assert.equal(restored.state.workers.B.stage,'read');
  assert.throws(()=>restoreConcurrency({past:[['A']],current:[]}),RangeError);
  assert.throws(()=>restoreConcurrency({past:[],current:['A','A','A']}),RangeError);
});
test('lock owner and one waiting attempt survive restoration',()=>{
  const restored=restoreLocking(['A','B','A']);
  assert.equal(restored.owner,'A');assert.equal(restored.waited,true);
  assert.equal(restored.workers.A.stage,'write');assert.equal(restored.workers.B.stage,'acquire');
  assert.throws(()=>restoreLocking(['A','B','B']),RangeError);
});
