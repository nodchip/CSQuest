import test from 'node:test';import assert from 'node:assert/strict';
import {orderInventoryReplayCase} from '../src/order-inventory.js';
import {orderLabCreate,orderLabEdit,orderLabAct,orderLabNew,orderLabDone,orderLabRestore} from '../src/order-inventory-lab.js';
test('constructed examples accumulate milestones without discarding unfinished drafts',()=>{
 const q=orderLabCreate();orderLabAct(q,'finish');assert.equal(q.seen.empty,true);orderLabNew(q);orderLabEdit(q,'append','star');orderLabAct(q,'read');const copy=orderLabRestore(q);assert.equal(copy.history.length,1);orderLabAct(q,'missing');orderLabAct(q,'finish');assert.equal(q.seen.missing,true);orderLabNew(q);orderLabEdit(q,'append','sun');orderLabEdit(q,'append','sun');for(const a of ['read','take','read','empty','finish'])orderLabAct(q,a);q.answer='cases';q.checked=true;assert.equal(orderLabDone(q),true);
});
test('all constructed sequences of up to three orders preserve expected inventory and decisions',()=>{
 const keys=['sun','moon','star'],sequences=[[]];for(let n=1;n<=3;n++){const prev=sequences.filter(x=>x.length===n-1);for(const seq of prev)for(const key of keys)sequences.push([...seq,key]);}
 for(let code=0;code<64;code++){let x=code;const initial={};for(const key of keys){const v=x%4;x=Math.floor(x/4);if(v)initial[key]=v-1;}
  for(const orders of sequences){const expected={...initial},history=[];for(const key of orders){history.push('read');if(!Object.hasOwn(expected,key))history.push('missing');else if(expected[key]===0)history.push('empty');else{history.push('take');expected[key]--;}}history.push('finish');const actual=orderInventoryReplayCase({orders,stock:initial},history);assert.deepEqual(actual.stock,expected);assert.equal(actual.results.length,orders.length);assert.equal(actual.done,true);}}
 assert.throws(()=>orderInventoryReplayCase({orders:['sun'],stock:{sun:-1}},[]),RangeError);assert.throws(()=>orderLabEdit({...orderLabCreate(),history:['read']},'append','sun'),RangeError);
});
