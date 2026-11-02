import {test} from 'node:test';
import assert from 'node:assert/strict';
import {abaActions,abaInitial,abaExecute,abaReplay,abaCreate,abaStep,abaComplete,abaRestore} from '../src/aba-stack.js';

for(const id of ['plain','tagged'])test(`${id}: old head returns while the remembered successor is no longer in the stack`,()=>{
 const s=abaInitial(id),h=[];for(const a of ['observe','next','popA','popB','pushA']){for(const wrong of Object.keys(abaActions).filter(x=>x!==a))assert.throws(()=>abaExecute(structuredClone(s),wrong));abaExecute(s,a);h.push(a);assert.deepEqual(abaReplay(id,h),s);}assert.equal(s.head,'A');assert.equal(s.nextA,null);assert.equal(s.seenNext,'B');assert.equal(s.stamp,3);assert.deepEqual(s.held,['B']);
 assert.throws(()=>abaExecute(structuredClone(s),`compare:${id==='plain'?'fail':'success'}`));abaExecute(s,`compare:${id==='plain'?'success':'fail'}`);
 if(id==='plain'){assert.equal(s.head,'B');assert(s.held.includes('B'));assert.equal(s.stage,'done');}else{assert.equal(s.head,'A');assert.equal(s.stage,'refresh');abaExecute(s,'refresh');abaExecute(s,'compare2:success');assert.equal(s.head,null);assert.equal(s.stage,'done');}
});
test('both outcomes and reflection required; saved steps replay and wrong predictions are rejected',()=>{
 const q=abaCreate();for(const [id,actions] of [['plain',['observe','next','popA','popB','pushA','compare:success']],['tagged',['observe','next','popA','popB','pushA','compare:fail','refresh','compare2:success']]]){q.selected=id;for(const a of actions){abaStep(q,a);assert.deepEqual(abaRestore(q),q);}}assert(!abaComplete(q));q.answer='history';assert(abaComplete(q));const bad=structuredClone(q);bad.trials.tagged[5]='compare:success';assert.throws(()=>abaRestore(bad));
});
