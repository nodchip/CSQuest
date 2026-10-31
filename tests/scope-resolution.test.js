import test from 'node:test';
import assert from 'node:assert/strict';
import {scopeRules,scopeCalls,scopeResult,createScope,scopeCorrect,scopeComplete,restoreScope} from '../src/scope-resolution.js';
test('lexical definition and dynamic callers select the correct binding',()=>{
 assert.equal(scopeResult('lexical','direct'),'workshop');assert.equal(scopeResult('lexical','room'),'workshop');assert.equal(scopeResult('dynamic','direct'),'workshop');assert.equal(scopeResult('dynamic','room'),'room');assert.throws(()=>scopeResult('bad','room'));assert.throws(()=>scopeResult('lexical','bad'));
});
test('all four checked choices are needed and saved state is independent',()=>{
 const s=createScope();for(const rule of Object.keys(scopeRules))for(const call of Object.keys(scopeCalls)){const choice=scopeResult(rule,call);s.trials[rule][call]={choice,checked:true};assert.equal(scopeCorrect(rule,call,s.trials[rule][call]),true);}assert.equal(scopeComplete(s),true);assert.deepEqual(restoreScope(s),s);const copy=restoreScope(s);copy.trials.dynamic.room.choice='workshop';assert.equal(scopeComplete(copy),false);assert.equal(s.trials.dynamic.room.choice,'room');assert.throws(()=>restoreScope({...s,rule:'bad'}));
});
