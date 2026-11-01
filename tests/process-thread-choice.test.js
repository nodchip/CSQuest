import test from 'node:test';
import assert from 'node:assert/strict';
import {processThreadCases,processThreadSequence,processThreadReplay,createProcessThreadChoice,processThreadChoiceComplete,restoreProcessThreadChoice} from '../src/process-thread-choice.js';
test('ordered observations distinguish sharing, messaging and process termination',()=>{
 const expected={threads:[1,1,null],separate:[0,0,0],message:[0,1,1]};
 for(const id of Object.keys(processThreadCases)){const h=processThreadSequence(id),state=processThreadReplay(id,h);assert.deepEqual(state.reads,expected[id]);assert.equal(state.aAlive,false);assert.equal(state.bAlive,id!=='threads');}
 assert.throws(()=>processThreadReplay('threads',['read']));assert.throws(()=>processThreadReplay('separate',['update','read','transfer']));
});
test('all histories, applications and the qualified reflection are required',()=>{
 const s=createProcessThreadChoice();for(const id of Object.keys(processThreadCases))s.histories[id]=processThreadSequence(id);s.answers={shared:'threads',isolation:'processes'};s.reflection='limits';s.checked=true;assert.ok(processThreadChoiceComplete(s));assert.deepEqual(restoreProcessThreadChoice(s),s);s.histories.message.pop();assert.equal(processThreadChoiceComplete(s),false);assert.throws(()=>restoreProcessThreadChoice({...s,histories:{...s.histories,message:['crash']}}));
});
