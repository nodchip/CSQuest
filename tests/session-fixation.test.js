import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixationActions,fixationInitial,fixationExecute,fixationReplay,fixationCreate,fixationStep,fixationComplete,fixationRestore} from '../src/session-fixation.js';

for(const [id,expected] of [['keep','allowed'],['rotate','denied']])test(`${id}: authenticate, test old token, and invalidate at logout`,()=>{
 const s=fixationInitial(id),history=[];
 const step=(action,guess=null)=>{for(const other of Object.keys(fixationActions).filter(a=>a!==action))assert.throws(()=>fixationExecute(structuredClone(s),other));if(guess)assert.throws(()=>fixationExecute(structuredClone(s),action,guess==='allowed'?'denied':'allowed'));fixationExecute(s,action,guess);history.push(guess?`${action}:${guess}`:action);assert.deepEqual(fixationReplay(id,history),s);};
 step('plant');step('login');step('old',expected);assert.equal(s.oldResult,expected);
 if(id==='rotate'){assert.equal(s.valid,'S1');assert.equal(s.attacker,'S0');step('leak');step('fresh','allowed');assert.equal(s.newResult,'allowed');}
 step('logout');assert.equal(s.valid,null);assert.equal(s.authenticated,false);step('after','denied');assert.equal(s.afterResult,'denied');assert.throws(()=>fixationExecute(s,'after','denied'));
});
test('completion requires both trials and reflections; saved trials are replayed and validated',()=>{
 const q=fixationCreate();for(const [id,steps] of [['keep',['plant','login','old:allowed','logout','after:denied']],['rotate',['plant','login','old:denied','leak','fresh:allowed','logout','after:denied']]]){q.selected=id;for(const item of steps){const [action,guess]=item.split(':');fixationStep(q,action,guess??null);assert.deepEqual(fixationRestore(q),q);}}
 q.answer='old';assert(!fixationComplete(q));q.logout='invalidate';assert(fixationComplete(q));const bad=structuredClone(q);bad.trials.rotate[2]='old:allowed';assert.throws(()=>fixationRestore(bad));bad.trials.rotate[2]='old:denied:extra';assert.throws(()=>fixationRestore(bad));
});
