import {test} from 'node:test';
import assert from 'node:assert/strict';
import {complementReplay,complementCreate,complementAdvance,complementComplete,complementRestore} from '../src/complement-recognizers.js';

test('alternating recognized and complement cases stop at the first acceptance',()=>{
 assert.deepEqual(complementReplay('moon',5),{steps:[3,2],result:'inside',finished:true});
 assert.deepEqual(complementReplay('star',8),{steps:[4,4],result:'outside',finished:true});
 assert.deepEqual(complementReplay('cloud',10),{steps:[5,5],result:null,finished:true});
 assert.equal(complementReplay('moon',4).result,null);assert.equal(complementReplay('star',7).result,null);
 assert.throws(()=>complementReplay('moon',6));assert.throws(()=>complementReplay('star',9));assert.throws(()=>complementReplay('cloud',11));
});
test('all observed results and the prerequisite of two correct recognizers are required',()=>{
 let q=complementCreate();for(const id of ['moon','star','cloud']){q.selected=id;for(let i=0;i<10;i++)complementAdvance(q,2);q= complementRestore(q);q.answers[id]=({moon:'inside',star:'outside',cloud:'pending'})[id];}
 assert.deepEqual(q.ticks,{moon:5,star:8,cloud:10});q.reflection='either';assert.equal(complementComplete(q),false);q.reflection='both';assert.equal(complementComplete(q),true);const copy=complementRestore(q);copy.answers.cloud='outside';assert.equal(complementComplete(copy),false);assert.equal(complementComplete(q),true);assert.throws(()=>complementRestore({...q,ticks:{...q.ticks,moon:6}}));
});
