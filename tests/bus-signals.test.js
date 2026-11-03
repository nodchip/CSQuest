import test from 'node:test';
import assert from 'node:assert/strict';
import {busNames,busCases,busCreate,busAnswer,busComplete,busRestore} from '../src/bus-signals.js';

test('six read and write messages have exactly the expected signal role',()=>{
 const expected=['address','control','data','address','data','control'];assert.deepEqual(busCases.map(item=>item.answer),expected);
 for(let index=0;index<busCases.length;index++)for(const choice of Object.keys(busNames)){const q=busCreate();q.index=index;const result=busAnswer(q,choice);assert.equal(result.ok,choice===expected[index]);assert.equal(q.completed.length,choice===expected[index]?1:0);assert.ok(result.message.length>0);}
});
test('both operations and reflection are required; repeated answers do not duplicate records',()=>{
 const q=busCreate();for(let index=0;index<busCases.length;index++){q.index=index;busAnswer(q,busCases[index].answer);busAnswer(q,busCases[index].answer);}assert.equal(q.completed.length,6);assert.equal(busComplete(q),false);q.reflection='roles';assert.equal(busComplete(q),true);const copy=busRestore(q);copy.completed.pop();assert.equal(q.completed.length,6);assert.throws(()=>busRestore({...q,completed:['bad']}));assert.throws(()=>busRestore({...q,completed:[q.completed[0],q.completed[0]]}));assert.throws(()=>busAnswer(q,'bad'));
});
