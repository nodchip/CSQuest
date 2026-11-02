import test from 'node:test';
import assert from 'node:assert/strict';
import {workStealAct,workStealReplay} from '../src/work-stealing.js';
import {costModes,costReplay,costCreate,costCheck,costComplete,costRestore} from '../src/work-stealing-cost.js';

function finished(mode){let s=costReplay(mode,['steal']);while(s.completed.length<4){const result=workStealAct(s,'tick');assert.equal(result.ok,true);s=result.state;}return s;}
test('green works while blue waits; fixed transfer costs yield 5, 8 and 9 ticks',()=>{
 const first=costReplay('5',['steal','tick']);assert.deepEqual(first.completed,['D']);assert.deepEqual(first.b,{id:'A',remaining:3,wait:4});
 for(const [mode,ticks] of [['0',5],['5',8],['6',9]]){const s=finished(mode);assert.equal(s.ticks,ticks);assert.deepEqual([...s.completed].sort(),['A','B','C','D']);}
 assert.deepEqual(workStealReplay('steal',['steal','tick']),costReplay('0',['steal','tick']));assert.throws(()=>costReplay('5',['tick']),RangeError);assert.throws(()=>costReplay('5',['steal','steal']),RangeError);
});
test('each completed comparison and reflection is required; saved histories are validated',()=>{
 const q=costCreate();q.answer='faster';assert.throws(()=>costCheck(q),RangeError);for(const mode of costModes){q.mode=mode;q.runs[mode]=finished(mode).history;q.answer=mode==='0'?'faster':mode==='5'?'same':'slower';costCheck(q);}
 assert.equal(costComplete(q),false);q.reflection='overhead';assert.equal(costComplete(q),true);const copy=costRestore(q);copy.runs['5'].pop();assert.equal(q.runs['5'].length,9);assert.throws(()=>costRestore({...q,last:{...q.last,correct:false}}),RangeError);assert.throws(()=>costRestore({...q,runs:{...q.runs,'5':['tick']}}),RangeError);
});
