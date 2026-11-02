import test from 'node:test';
import assert from 'node:assert/strict';
import {workStealJobs,workStealInitial,workStealAct,workStealReplay,workStealCreate,workStealComplete,workStealRestore} from '../src/work-stealing.js';

test('fixed work requires eight ticks alone and five for a concrete stealing schedule',()=>{
 const single=workStealReplay('static',Array(8).fill('tick'));assert.equal(single.completed.length,4);assert.equal(single.ticks,8);assert.equal(single.stolen,0);
 const fast=workStealReplay('steal',['steal','tick','tick','tick','steal','tick','tick']);assert.equal(fast.completed.length,4);assert.equal(fast.ticks,5);assert.equal(fast.stolen,2);assert.deepEqual([...fast.completed].sort(),Object.keys(workStealJobs).sort());
 assert.equal(workStealAct(workStealInitial('static'),'steal').ok,false);assert.equal(workStealAct(fast,'tick').ok,false);assert.throws(()=>workStealReplay('steal',['steal','steal']),RangeError);
});
test('all reachable actions conserve jobs and best tick count in this restricted model is five',()=>{
 const visited=new Set(),stack=[workStealInitial('steal')],finishes=[];while(stack.length){const s=stack.pop(),key=JSON.stringify([s.queue,s.a,s.b,[...s.completed].sort(),s.ticks,s.stolen]);if(visited.has(key))continue;visited.add(key);const jobs=[...s.queue,...(s.a?[s.a.id]:[]),...(s.b?[s.b.id]:[]),...s.completed];assert.deepEqual(jobs.sort(),Object.keys(workStealJobs).sort());if(s.completed.length===4){finishes.push(s.ticks);continue;}for(const a of ['steal','tick']){const r=workStealAct(s,a);if(r.ok)stack.push(r.state);}}
 assert.equal(Math.min(...finishes),5);assert.ok(finishes.includes(8));
});
test('both runs, five-tick example, reflection and valid saved replay are required',()=>{
 const q=workStealCreate();q.runs.static=Array(8).fill('tick');q.runs.steal=['steal','tick','tick','tick','steal','tick','tick'];assert.equal(workStealComplete(q),false);q.reflection='tradeoff';assert.equal(workStealComplete(q),true);const saved=workStealRestore(q);saved.runs.static.pop();assert.equal(q.runs.static.length,8);assert.throws(()=>workStealRestore({...q,runs:{...q.runs,static:['steal']}}),RangeError);
});
