import test from 'node:test';
import assert from 'node:assert/strict';
import {timerSchedule,timerScenarios,createTimerScheduling,timerTrialComplete,timerSchedulingComplete,restoreTimerScheduling} from '../src/timer-scheduling.js';
test('timer and cooperation determine the first opportunity of the arriving job',()=>{
 const expected={cooperative:'AAAABAA',stubborn:'AAAAAAB',cooperativeTimer:'AABAAAA',stubbornTimer:'AABAAAA'};
 for(const [id,sequence] of Object.entries(expected)){const r=timerSchedule(id,7);assert.equal(r.history.join(''),sequence);assert.equal(r.bStart,sequence.indexOf('B'));assert.equal(r.a,6);assert.equal(r.b,1);for(let n=0;n<=7;n++)assert.deepEqual(timerSchedule(id,n).history,r.history.slice(0,n));}
 assert.throws(()=>timerSchedule('stubborn',8));assert.throws(()=>timerSchedule('bad',0));
});
test('completion and restoration validate each replayed timeline',async()=>{
 const s=createTimerScheduling();for(const id of Object.keys(timerScenarios)){s.trials[id]={steps:7,guess:timerSchedule(id,7).bStart,verified:true};assert.ok(timerTrialComplete(id,s.trials[id]));}s.answer='limited';s.checked=true;assert.equal(timerSchedulingComplete(s),false);const {timerQueueAct}=await import('../src/timer-queue-lab.js');for(const action of ['arm:3','tick','insert','arm:2','advance','service','arm:3','advance','service','arm:7','advance','service'])s.queue=timerQueueAct(s.queue,action).state;assert.ok(timerSchedulingComplete(s));assert.deepEqual(restoreTimerScheduling(s),s);const old=structuredClone(s);delete old.queue;assert.equal(timerSchedulingComplete(restoreTimerScheduling(old)),false);s.trials.stubborn.guess=2;assert.equal(timerSchedulingComplete(s),false);assert.throws(()=>restoreTimerScheduling(s));
});
