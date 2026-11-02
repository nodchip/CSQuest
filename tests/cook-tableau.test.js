import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cookCases,cookEvaluate,cookScan,cookCreate,cookToggle,cookCheck,cookAdvance,cookComplete,cookRestore} from '../src/cook-tableau.js';

test('CNF agrees with independently checked input, nondeterministic choice and terminal state for all assignments',()=>{
 for(const [id,c] of Object.entries(cookCases))for(let m=0;m<16;m++){const X=!!(m&8),C=!!(m&4),A=!!(m&2),R=!!(m&1),expected=X===!!c.input&&A===(X&&C)&&R===!A&&(!c.goal||A);assert.equal(cookEvaluate(id,m).valid,expected,`${id}:${m}`);}
 assert.deepEqual(cookScan('pass',16),[14]);assert.deepEqual(cookScan('block',16),[]);assert.deepEqual(cookScan('noGoal',16),[1,5]);assert.throws(()=>cookScan('pass',17));
});
test('all scans, an explicitly constructed accepting assignment and the goal condition are required',()=>{
 let q=cookCreate();for(const id of Object.keys(cookCases)){q.selected=id;for(let i=0;i<4;i++)cookAdvance(q,4);q.trials[id].answer=String(cookScan(id,16).length);q=cookRestore(q);}q.reflection='goal';assert.equal(cookComplete(q),false);q.selected='pass';for(const bit of [8,4,2])cookToggle(q,bit);cookCheck(q);assert.equal(cookComplete(q),true);const copy=cookRestore(q);copy.trials.pass.checked.length=0;assert.equal(cookComplete(copy),false);assert.equal(cookComplete(q),true);assert.throws(()=>cookRestore({...q,trials:{...q.trials,pass:{...q.trials.pass,checked:[14,14]}}}));
});
