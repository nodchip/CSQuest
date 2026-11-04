import test from 'node:test';
import assert from 'node:assert/strict';
import {dtnCases,createDtnTrial,dtnStep,createDtn,dtnComplete,restoreDtn} from '../src/delay-tolerant.js';
test('all feasible schedules require storing the message until the next contact',()=>{
 for(const [id,c] of Object.entries(dtnCases)){
  let states=[createDtnTrial()],delivered=[];for(let i=0;i<c.contacts.length;i++){const next=[];for(const t of states)if(t.status==='active')for(const action of ['a','b','c','wait']){const n=dtnStep(id,t,action);if(n.history.length===t.history.length+1)next.push(n);}delivered.push(...next.filter(t=>t.status==='delivered'));states=next;}
  const expected={quick:[['b','c']],gap:[['b','wait','c']],choice:[['wait','c'],['b','wait','c']]};
  assert.deepEqual(delivered.map(t=>t.history),expected[id]);
 }
 const t=createDtnTrial();assert.equal(dtnStep('quick',t,'c').time,0);assert.equal(dtnStep('quick',t,'a').time,0);
});
test('both delivered routes are needed and histories are validated on restore',()=>{
 const s=createDtn();for(const [id,actions] of Object.entries({quick:['b','c'],gap:['b','wait','c'],choice:['wait','c']})){let t=s.trials[id];for(const action of actions)t=dtnStep(id,t,action);s.trials[id]=t;}assert.equal(dtnComplete(s),true);assert.deepEqual(restoreDtn(s),s);const copy=restoreDtn(s);copy.trials.gap.history[1]='c';assert.throws(()=>restoreDtn(copy));assert.equal(s.trials.gap.history[1],'wait');
});

test('real example choice restores and legacy drafts remain valid',()=>{
 const old=createDtn();delete old.example;assert.equal(restoreDtn(old).example,null);
 for(const example of ['store','instant','guarantee']){const draft=createDtn();draft.example=example;assert.equal(restoreDtn(draft).example,example);}
 const invalid=createDtn();invalid.example='other';assert.throws(()=>restoreDtn(invalid));
});

test('legacy drafts acquire the new scenario without losing existing progress',()=>{
 const old=createDtn();old.trials.quick=dtnStep('quick',old.trials.quick,'b');delete old.trials.choice;const restored=restoreDtn(old);assert.equal(restored.trials.quick.holder,'b');assert.deepEqual(restored.trials.choice,createDtnTrial());assert.equal(dtnComplete(restored),false);
});
