import test from 'node:test';
import assert from 'node:assert/strict';
import {jitCases,jitModes,jitEvent,jitStep,jitCost,createJit,jitCorrect,jitComplete,restoreJit} from '../src/jit-workshop.js';
test('hot threshold and fixed costs produce the stated short and long comparisons',()=>{
 assert.deepEqual(Array.from({length:5},(_,i)=>jitEvent('jit',i).route),['interpret','interpret','compile','native','native']);
 for(const [id,c] of Object.entries(jitCases))for(const mode of Object.keys(jitModes)){const history=Array.from({length:c.runs},(_,i)=>jitEvent(mode,i).route);assert.equal(jitCost(mode,history),id==='short'?8:mode==='interpret'?20:17);}
 assert.throws(()=>jitEvent('jit',5));
});
test('wrong actions do not advance and restoration validates each recorded action',()=>{
 const s=createJit();for(const [id,c] of Object.entries(jitCases)){const t=s.trials[id];for(const mode of Object.keys(jitModes)){let run=t.runs[mode];assert.equal(jitStep(id,mode,run,'native').history.length,0);while(run.history.length<c.runs)run=jitStep(id,mode,run,jitEvent(mode,run.history.length).route);t.runs[mode]=run;}t.comparison=c.answer;t.checked=true;assert.equal(jitCorrect(id,t),true);}assert.equal(jitComplete(s),true);assert.deepEqual(restoreJit(s),s);const copy=restoreJit(s);copy.trials.long.runs.jit.history[2]='native';assert.throws(()=>restoreJit(copy));assert.equal(s.trials.long.runs.jit.history[2],'compile');
});
