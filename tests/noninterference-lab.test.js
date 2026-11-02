import test from 'node:test';
import assert from 'node:assert/strict';
import {niModes,niPairs,niSecrets,niPublics,niOutput,niCompare,niAudit,niCreate,niCheck,niComplete,niRestore} from '../src/noninterference-lab.js';

test('finite output tables and ordered pair audits match independent counts',()=>{
 assert.deepEqual(niSecrets.map(s=>niOutput('direct',s,0)),[0,1,2,3]);assert.deepEqual(niSecrets.map(s=>niOutput('parity',s,0)),[0,1,0,1]);for(const p of niPublics)assert.deepEqual(niSecrets.map(s=>niOutput('public',s,p)),Array(4).fill(p));
 assert.deepEqual(niCompare('parity','even',0),[0,0]);assert.deepEqual(niCompare('parity','odd',0),[0,1]);
 assert.deepEqual(niAudit('direct'),{comparisons:32,differences:24});assert.deepEqual(niAudit('parity'),{comparisons:32,differences:16});assert.deepEqual(niAudit('public'),{comparisons:32,differences:0});assert.throws(()=>niOutput('direct',4,0),RangeError);
});
test('six predictions and three exhaustive finite audits plus reflection are required',()=>{
 const q=niCreate();q.answer='same';niCheck(q);assert.equal(q.last.correct,false);assert.deepEqual(q.seen,[]);
 for(const mode of Object.keys(niModes))for(const pair of Object.keys(niPairs)){q.mode=mode;q.pair=pair;q.pub=1;const [a,b]=niCompare(mode,pair,1);q.answer=a===b?'same':'different';niCheck(q);}
 q.audited=Object.keys(niModes);assert.equal(niComplete(q),false);q.reflection='all';assert.equal(niComplete(q),true);const copy=niRestore(q);copy.seen.pop();assert.equal(q.seen.length,6);assert.throws(()=>niRestore({...q,last:{...q.last,correct:false}}),RangeError);assert.throws(()=>niRestore({...q,audited:['direct','direct']}),RangeError);
});
