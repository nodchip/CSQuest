import test from 'node:test';
import assert from 'node:assert/strict';
import {createSchedule,runJob} from '../src/scheduling.js';

function execute(policy,sequence) {let state=createSchedule(policy);for(const id of sequence)state=runJob(state,id);return state;}

test('round robin rotates unfinished jobs and completes at the expected times',()=>{
  const state=execute('rr',['A','B','C','A','B','A']);
  assert.equal(state.done,true);assert.equal(state.time,6);
  assert.deepEqual(state.completion,{C:3,B:5,A:6});
  assert.deepEqual(state.firstRun,{A:0,B:1,C:2});
});
test('first come first served runs each job until completion',()=>{
  const state=execute('fcfs',['A','A','A','B','B','C']);
  assert.equal(state.done,true);assert.equal(state.time,6);
  assert.deepEqual(state.completion,{A:3,B:5,C:6});
  assert.deepEqual(state.firstRun,{A:0,B:3,C:5});
});
test('out of order and finished jobs cannot advance the clock',()=>{
  const initial=createSchedule('rr'), wrong=runJob(initial,'B');
  assert.equal(wrong.time,0);assert.deepEqual(wrong.queue,['A','B','C']);
  assert.throws(()=>runJob(initial,'Z'),RangeError);
  const done=execute('fcfs',['A','A','A','B','B','C']);
  assert.throws(()=>runJob(done,'A'));
});
