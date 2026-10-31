import test from 'node:test';
import assert from 'node:assert/strict';
import {dtnCases,createDtnTrial,dtnStep,createDtn,dtnComplete,restoreDtn} from '../src/delay-tolerant.js';
test('all feasible schedules require storing the message until the next contact',()=>{
 for(const [id,c] of Object.entries(dtnCases)){
  let states=[createDtnTrial()];for(let i=0;i<c.contacts.length;i++){const next=[];for(const t of states)if(t.status==='active')for(const action of ['a','b','c','wait']){const n=dtnStep(id,t,action);if(n.history.length===t.history.length+1)next.push(n);}states=next;}
  assert.deepEqual(states.filter(t=>t.status==='delivered').map(t=>t.history),[id==='quick'?['b','c']:['b','wait','c']]);
 }
 const t=createDtnTrial();assert.equal(dtnStep('quick',t,'c').time,0);assert.equal(dtnStep('quick',t,'a').time,0);
});
test('both delivered routes are needed and histories are validated on restore',()=>{
 const s=createDtn();for(const [id,actions] of Object.entries({quick:['b','c'],gap:['b','wait','c']})){let t=s.trials[id];for(const action of actions)t=dtnStep(id,t,action);s.trials[id]=t;}assert.equal(dtnComplete(s),true);assert.deepEqual(restoreDtn(s),s);const copy=restoreDtn(s);copy.trials.gap.history[1]='c';assert.throws(()=>restoreDtn(copy));assert.equal(s.trials.gap.history[1],'wait');
});
