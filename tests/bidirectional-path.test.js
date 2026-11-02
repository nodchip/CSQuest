import test from 'node:test';
import assert from 'node:assert/strict';
import {bdReplay,bdWeight,bdCreate,bdAct,bdCompare,bdRestore,bdComplete} from '../src/bidirectional-path.js';
test('all pairs agree on visibility regardless of construction method',()=>{
 for(const mode of ['eye','both'])for(const a of ['A','B'])for(const b of ['C','D']){const r=bdReplay(mode,[`camera:${a}`,`${mode==='eye'?'next':'light'}:${b}`,'check']);assert.equal(r.result,(a==='A'&&b==='C')||(a==='B'&&b==='D')?'visible':'blocked');}
 assert.throws(()=>bdReplay('both',['light:C']));assert.throws(()=>bdReplay('eye',['camera:A','light:C']));assert.throws(()=>bdReplay('both',['camera:A','check']));assert.equal(bdWeight('naive').total,2);assert.equal(bdWeight('balanced').total,1);
});
test('partial paths restore; both methods, both visibility cases, both weights and reflections are required',()=>{
 const q=bdCreate();bdAct(q,'camera:A');assert.deepEqual(bdRestore(q),q);assert.throws(()=>bdRestore({...q,trials:{...q.trials,both:['check']}}));
 for(const mode of ['eye','both'])for(const b of ['C','D']){q.mode=mode;q.trials[mode]=[];for(const a of ['camera:A',`${mode==='eye'?'next':'light'}:${b}`,'check'])bdAct(q,a);}
 for(const w of ['naive','balanced']){q.weight=w;bdCompare(q);}q.visibility='test';assert.equal(bdComplete(q),false);q.weighting='pdf';assert.equal(bdComplete(q),true);
});
