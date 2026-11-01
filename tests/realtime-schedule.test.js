import test from 'node:test';
import assert from 'node:assert/strict';
import {realTimeTrace,realTimeCreate,realTimeStep,realTimeComplete,realTimeRestore} from '../src/realtime-schedule.js';

test('fixed priority misses B at time 6 while earliest deadline meets all deadlines through time 12',()=>{
 const fixed=realTimeTrace('fixed',[...'aabbaabbaabb']);
 const deadline=realTimeTrace('deadline',[...'aabbbaabaabb']);
 assert.deepEqual(fixed.misses,[{id:'b',release:0,deadline:6,remaining:1}]);
 assert.deepEqual(deadline.misses,[]);
 assert.deepEqual(deadline.jobs.map(j=>[j.id,j.release,j.deadline,j.remaining]),[['a',0,4,0],['b',0,6,0],['a',4,8,0],['b',6,12,0],['a',8,12,0]]);
 assert.throws(()=>realTimeTrace('fixed',['b']));
});
test('every tick requires the prescribed policy, history replays and both schedules are needed',()=>{
 const s=realTimeCreate();assert.equal(realTimeStep(s,'b'),false);
 for(const mode of ['fixed','deadline']){s.mode=mode;while(s.trials[mode].length<12){const next=realTimeTrace(mode,s.trials[mode]).next;assert.equal(realTimeStep(s,next),true);}assert.equal(realTimeStep(s,'a'),false);}
 assert.equal(realTimeComplete(s),false);s.answer='different';s.checked=true;assert.equal(realTimeComplete(s),true);
 const restored=realTimeRestore(s);restored.trials.fixed.pop();assert.equal(s.trials.fixed.length,12);assert.throws(()=>realTimeRestore({...s,trials:{...s.trials,deadline:['b']}}));
});
