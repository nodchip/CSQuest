import test from 'node:test';
import assert from 'node:assert/strict';
import {schedulerGoalPolicies,goalSchedule,createSchedulerGoals,schedulerGoalsComplete,restoreSchedulerGoals} from '../src/scheduler-goals.js';
test('deadline priority and round robin produce distinct start and completion times',()=>{
 const a=goalSchedule('edf',['A','A','A','B','B']);assert.deepEqual(a.first,{A:0,B:3});assert.deepEqual(a.finished,{A:3,B:5});assert.equal(a.next,null);
 const b=goalSchedule('round',['A','B','A','B','A']);assert.deepEqual(b.first,{A:0,B:1});assert.deepEqual(b.finished,{A:5,B:4});assert.equal(b.next,null);
 assert.equal(goalSchedule('round',['A','B','A']).next,'B');assert.throws(()=>goalSchedule('round',['B']));assert.throws(()=>goalSchedule('edf',['A','B']));
});
test('both histories and appropriate choices are needed and restored',()=>{
 const s=createSchedulerGoals();s.histories={edf:['A','A','A','B','B'],round:['A','B','A','B','A']};s.answers={deadline:'edf',response:'round'};s.reflection='limits';s.checked=true;assert.ok(schedulerGoalsComplete(s));assert.deepEqual(restoreSchedulerGoals(s),s);s.histories.edf.pop();assert.equal(schedulerGoalsComplete(s),false);assert.throws(()=>restoreSchedulerGoals({...s,histories:{...s.histories,round:['B']}}));assert.equal(Object.keys(schedulerGoalPolicies).length,2);
});
