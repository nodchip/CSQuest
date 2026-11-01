import test from 'node:test';
import assert from 'node:assert/strict';
import {smoothingWords,smoothingFraction,createSmoothing,restoreSmoothing,smoothingComplete} from '../src/bigram-smoothing.js';
import {createWordOrder,restoreWordOrder} from '../src/word-order.js';
test('both distributions use the same fixed counts and sum to one',()=>{
 assert.deepEqual(Object.values(smoothingWords).map(x=>x.count),[3,1,0]);
 assert.deepEqual(Object.keys(smoothingWords).map(k=>smoothingFraction('raw',k)),['3/4','1/4','0']);
 assert.deepEqual(Object.keys(smoothingWords).map(k=>smoothingFraction('add',k)),['4/7','2/7','1/7']);
 assert.equal((3+1+0)/4,1);assert.equal((4+2+1)/7,1);assert.throws(()=>smoothingFraction('x','fly'));
});
test('all six checked predictions and migrated drafts are required',()=>{
 const old=createWordOrder();delete old.smoothing;assert.equal(smoothingComplete(restoreWordOrder(old).smoothing),false);
 const s=createSmoothing();for(const m of ['raw','add'])for(const id of Object.keys(smoothingWords))s.choices[m][id]={answer:smoothingFraction(m,id),checked:true};assert.equal(smoothingComplete(s),true);
 const copy=restoreSmoothing(s);copy.choices.add.sing.answer='0';assert.equal(smoothingComplete(copy),false);assert.equal(smoothingComplete(s),true);
 assert.throws(()=>restoreSmoothing({...s,mode:'invalid'}));
});
