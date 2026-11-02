import {test} from 'node:test';
import assert from 'node:assert/strict';
import {recogReplay,recogCreate,recogAdvance,recogComplete,recogRestore} from '../src/recognizer-schedule.js';

test('sequential search gets stuck while fair rounds advance all unfinished scrolls',()=>{
 assert.deepEqual(recogReplay('serial',18).steps,[3,15,0]);assert.deepEqual(recogReplay('round',18).steps,[3,9,6]);
 assert.deepEqual(recogReplay('round',6).steps,[2,2,2]);assert.deepEqual(recogReplay('round',15).accepted,[true,false,true]);
 for(const mode of ['serial','round'])for(let t=0;t<=18;t++){const s=recogReplay(mode,t);assert.equal(s.steps.reduce((a,b)=>a+b,0),t);assert.equal(s.history.length,t);assert.equal(s.accepted[0],s.steps[0]===3);assert.equal(s.accepted[2],s.steps[2]===6);}
 assert.throws(()=>recogReplay('round',19));assert.throws(()=>recogReplay('bad',0));
});
test('comparison and both conclusions required; saved state is validated and copied',()=>{
 let q=recogCreate();for(const mode of ['serial','round']){q.mode=mode;for(let i=0;i<6;i++)recogAdvance(q,3);q=recogRestore(q);}q.answers={finite:'endless',fair:'progress'};assert.equal(recogComplete(q),false);q.answers.finite='unknown';assert.equal(recogComplete(q),true);const copy=recogRestore(q);copy.ticks.round=17;assert.equal(recogComplete(copy),false);assert.equal(recogComplete(q),true);assert.throws(()=>recogRestore({...q,ticks:{...q.ticks,round:19}}));
});
