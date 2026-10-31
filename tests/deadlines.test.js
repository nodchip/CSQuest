import test from 'node:test';
import assert from 'node:assert/strict';
import {createDeadlineTrial,deadlineStep,deadlineStatus,deadlineTrialResult,deadlineTrialCorrect,createDeadlines,deadlinesComplete,restoreDeadlines} from '../src/deadlines.js';
test('all feasible schedules reflect completion at or before the deadline',()=>{
 for(const [steps,want] of [[['seal','lamp','lamp'],'meet'],[['lamp','seal','lamp'],'meet'],[['lamp','lamp','seal'],'miss']]){let s=createDeadlineTrial(want);for(const step of steps)s=deadlineStep(s,step);assert.equal(deadlineTrialResult(s),want);assert.equal(deadlineTrialCorrect(s),true);assert.equal(s.finished.lamp<=3,true);assert.equal(deadlineStatus(s,'seal'),want==='meet'?'ontime':'late');}
});
test('both cases and replayed histories are needed; finished jobs cannot advance',()=>{
 const s=createDeadlines();for(const job of ['lamp','lamp','seal'])s.trials.miss=deadlineStep(s.trials.miss,job);for(const job of ['seal','lamp','lamp'])s.trials.meet=deadlineStep(s.trials.meet,job);assert.equal(deadlinesComplete(s),true);const copy=restoreDeadlines({selected:'meet',histories:{miss:s.trials.miss.history,meet:s.trials.meet.history}});assert.equal(deadlinesComplete(copy),true);assert.throws(()=>restoreDeadlines({selected:'miss',histories:{miss:['seal','seal'],meet:[]}}),RangeError);
});
