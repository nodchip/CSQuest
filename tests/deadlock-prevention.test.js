import test from 'node:test';
import assert from 'node:assert/strict';
import {preventionModes,preventionConditions,createPreventionTrial,stepPrevention,replayPrevention,preventionTrialComplete,createDeadlockPrevention,deadlockPreventionComplete,restoreDeadlockPrevention} from '../src/deadlock-prevention.js';
test('exhaustive interleavings find opposing deadlock but not in prevention modes',()=>{
 for(const mode of Object.keys(preventionModes)){const q=[createPreventionTrial(mode)],seen=new Set(),outcomes=new Set();while(q.length){const s=q.shift(),key=JSON.stringify({owners:s.owners,workers:s.workers,status:s.status,waited:s.waited});if(seen.has(key))continue;seen.add(key);if(s.status!=='playing'){outcomes.add(s.status);continue;}for(const w of ['A','B']){const n=stepPrevention(s,w);if(n)q.push(n);}}
  assert.ok(outcomes.has('done'));assert.equal(outcomes.has('deadlocked'),mode==='opposing');}
});
test('histories demonstrate deadlock and waiting with both prevention strategies',()=>{
 const s=createDeadlockPrevention();s.histories.opposing=['A','B','A','B'];s.histories.ordered=['A','B','A','A','B','B','B'];s.histories.atomic=['A','B','A','B','B'];
 for(const mode of Object.keys(preventionModes))assert.ok(preventionTrialComplete(mode,replayPrevention(mode,s.histories[mode])));
 s.conditions=Object.keys(preventionConditions);s.answer='necessary';s.checked=true;assert.ok(deadlockPreventionComplete(s));assert.deepEqual(restoreDeadlockPrevention(s),s);assert.throws(()=>replayPrevention('atomic',['A','B','B']));
});
