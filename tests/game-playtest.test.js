import test from 'node:test';
import assert from 'node:assert/strict';
import {playtestCreate,playtestResult,playtestRun,playtestDone,playtestRestore,playtestPlanRun,playtestPlanDone} from '../src/game-playtest.js';
import {createCaptions,restoreCaptions} from '../src/game-captions.js';

test('both fictional participants encounter barriers before the stated changes',()=>{
 for(const person of ['cue','control']){assert.equal(playtestResult(person,'initial'),false);assert.equal(playtestResult(person,'revised'),true);}assert.throws(()=>playtestResult('other','initial'));
});
test('each improvement affects its corresponding fictional trial, with legacy migration',()=>{
 const q=playtestCreate();for(const cue of [false,true])for(const control of [false,true])for(const person of ['cue','control']){q.plan.cue=cue;q.plan.control=control;assert.equal(playtestPlanRun(person,q.plan),person==='cue'?cue:control);}assert(playtestPlanDone(q.plan));assert.equal(q.plan.seen.length,8);const copy=playtestRestore(q);copy.plan.seen.pop();assert.equal(q.plan.seen.length,8);const {plan,...old}=q;assert.deepEqual(playtestRestore(old).plan,playtestCreate().plan);assert.throws(()=>playtestRestore({...q,plan:{cue:true,control:false,seen:['cue:22']}}));
});
test('both people and both trials are needed and old drafts remain readable',()=>{
 const q=playtestCreate();q.answer='repeat';for(const person of ['cue','control'])for(const version of ['initial','revised']){q.person=person;q.version=version;playtestRun(q);}assert(playtestDone(q));playtestRun(q);assert.equal(q.seen.length,4);const copy=playtestRestore(q);copy.seen.pop();assert.equal(q.seen.length,4);assert(!playtestDone(copy));assert.throws(()=>playtestRestore({...q,seen:['cue:unknown']}));const {playtest,...old}=createCaptions();assert.deepEqual(restoreCaptions(old),createCaptions());
});
