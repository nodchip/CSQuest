import test from 'node:test';
import assert from 'node:assert/strict';
import {createLockedTrial,stepLockedWorker} from '../src/locking.js';

test('a second worker waits until the lock is released, then both updates succeed',()=>{
  let state=createLockedTrial();
  state=stepLockedWorker(state,'A');
  state=stepLockedWorker(state,'B');
  assert.equal(state.waited,true);assert.equal(state.owner,'A');
  assert.equal(state.workers.B.stage,'acquire');assert.equal(state.value,0);
  for(const id of ['A','A','A','B','B','B','B']) state=stepLockedWorker(state,id);
  assert.equal(state.done,true);assert.equal(state.value,2);assert.equal(state.owner,null);
});

test('every progress-making interleaving preserves the two updates',()=>{
  const finished=[];
  function visit(state) {
    if(state.done){finished.push(state);return;}
    for(const id of ['A','B']) {
      const worker=state.workers[id];
      if(worker.stage==='done'||(worker.stage==='acquire'&&state.owner!==null)) continue;
      visit(stepLockedWorker(state,id));
    }
  }
  visit(createLockedTrial());
  assert.equal(finished.length,2);
  assert.ok(finished.every(state=>state.value===2&&state.owner===null));
});

test('unknown workers and completed workers cannot execute',()=>{
  let state=createLockedTrial();
  assert.throws(()=>stepLockedWorker(state,'C'),RangeError);
  for(const id of ['A','A','A','A']) state=stepLockedWorker(state,id);
  assert.throws(()=>stepLockedWorker(state,'A'),RangeError);
});
