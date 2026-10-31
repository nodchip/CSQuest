import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDeadlockCheck,expandDeadlock,deadlockHeld,deadlockCheckComplete,restoreDeadlockCheck} from '../src/deadlock-checking.js';
test('opposite ordering reaches a deadlock; common ordering exhausts the finite state space',()=>{
 const s=createDeadlockCheck();for(const mode of ['opposite','same'])while(s.trials[mode].status==='searching'){const t=s.trials[mode];for(const state of t.queue){const a=deadlockHeld(mode,state,'a'),b=deadlockHeld(mode,state,'b');assert.equal(a.some(key=>b.includes(key)),false);}s.trials[mode]=expandDeadlock(t);}assert.deepEqual(s.trials.opposite.counterexample.path,['A：赤の鍵を取る','B：青の鍵を取る']);assert.equal(s.trials.same.status,'safe');assert.equal(deadlockCheckComplete(s),true);
});
test('exploration resumes by replay and rejects impossible saved progress',()=>{
 const s=createDeadlockCheck();s.trials.opposite=expandDeadlock(s.trials.opposite);const copy=restoreDeadlockCheck({...s,trials:{...s.trials,opposite:{steps:1,status:'deadlock'}}});assert.equal(copy.trials.opposite.status,'searching');assert.deepEqual(copy.trials.opposite.seen,['0,0','1,0','0,1']);assert.throws(()=>restoreDeadlockCheck({...s,trials:{...s.trials,opposite:{steps:31}}}),RangeError);
});
