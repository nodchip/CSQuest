import test from 'node:test';
import assert from 'node:assert/strict';
import {planSchedule,replayScheduling,schedulingCases} from '../src/endgame-scheduling.js';

test('same arrivals under two policies yield the independently calculated schedules',()=>{
 const sequences=['AAAB','ABAA','ABBB','ABBB','AAB','ABA'];
 const finished=[{A:3,B:4},{B:2,A:4},{A:1,B:4},{A:1,B:4},{A:2,B:3},{B:2,A:3}];
 for(const [i,example] of schedulingCases.entries()){
  const plan=planSchedule(example);assert.equal(plan.steps.map(s=>s.current).join(''),sequences[i]);assert.deepEqual(plan.finished,finished[i]);
 }
 const history=sequences.flatMap(s=>[...s].map(x=>`run:${x}`));assert.equal(replayScheduling(history).done,true);
 const boundary=planSchedule(schedulingCases[5]).steps[1];
 assert.equal(boundary.time,1);assert.equal(boundary.current,'B');assert.deepEqual(boundary.ready,['A']);assert.deepEqual(boundary.remaining,{A:1,B:1});assert.deepEqual(boundary.finished,{});
 const afterShort=planSchedule(schedulingCases[1]).steps[2];assert.deepEqual(afterShort.finished,{B:2});assert.deepEqual(afterShort.remaining,{A:2,B:0});
});
test('a non-arrived or out-of-turn job is rejected',()=>{
 assert.equal(replayScheduling(['run:B']),null);
 assert.equal(replayScheduling(['run:A','run:B']),null);
 assert.equal(replayScheduling(['run:A','run:A','run:A','run:B','run:B']),null);
});
