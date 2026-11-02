import {test} from 'node:test';
import assert from 'node:assert/strict';
import {simtTasks,simtStats,simtCreate,simtSelect,simtRun,simtComplete,simtRestore} from '../src/simt-branches.js';

test('all 70 assignments of four sun tasks agree with independent group counts and preserve results',()=>{
 const expected={A:2,B:3,C:6,D:8,E:6,F:7,G:14,H:16},sun=simtTasks.filter(t=>t.kind==='sun').map(t=>t.id),moon=simtTasks.filter(t=>t.kind==='moon').map(t=>t.id);let cases=0;
 for(let mask=0;mask<256;mask++)if(mask.toString(2).replaceAll('0','').length===4){let a=0,b=0;const order=Array.from({length:8},(_,i)=>mask&(1<<i)?sun[a++]:moon[b++]),r=simtStats(order);const s=order.slice(0,4).filter(x=>sun.includes(x)).length,passes=(s>0?1:0)+(s<4?1:0)+(s<4?1:0)+(s>0?1:0);assert.equal(r.passes,passes);assert.equal(r.inactive,4*passes-8);assert.deepEqual(r.outputs,expected);cases++;}assert.equal(cases,70);
});
test('mixed and grouped trials, correct reflection, validated saved swaps are required',()=>{
 let q=simtCreate();simtRun(q);simtSelect(q,2);q=simtRestore(q);simtSelect(q,4);simtSelect(q,3);simtSelect(q,5);assert.equal(simtStats(q.order).passes,2);simtRun(q);q.answer='always';assert.equal(simtComplete(q),false);q.answer='tradeoff';assert.equal(simtComplete(q),true);const copy=simtRestore(q);copy.order[0]='H';assert.throws(()=>simtStats(copy.order));assert.equal(simtComplete(q),true);assert.throws(()=>simtRestore({...q,seen:[2,2]}));
});
