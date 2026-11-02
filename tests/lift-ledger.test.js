import test from 'node:test';
import assert from 'node:assert/strict';
import {liftCases,liftCounts,liftCreate,liftCheck,liftComplete,liftRestore} from '../src/lift-ledger.js';

test('three ledgers have independently calculated counts, comparisons and lift',()=>{
 const expected={common:[10,5,8,4,0,1],paired:[10,5,5,4,1,1.6],less:[10,5,8,3,-1,0.75]};
 for(const [id,values] of Object.entries(expected)){const c=liftCounts(id);assert.deepEqual([c.total,c.herb,c.bag,c.both,c.sign,c.lift],values,id);}
 assert.throws(()=>liftCounts('unknown'),RangeError);
});
test('three filters, correct comparison in each ledger and reflection are required',()=>{
 const q=liftCreate();q.answer='equal';assert.throws(()=>liftCheck(q),RangeError);q.observed=['common:herb','common:bag','common:both'];q.answer='above';liftCheck(q);assert.equal(q.last.correct,false);assert.equal(q.checked.length,0);
 for(const [id,answer] of [['common','equal'],['paired','above'],['less','below']]){q.scenario=id;for(const view of ['herb','bag','both'])if(!q.observed.includes(`${id}:${view}`))q.observed.push(`${id}:${view}`);q.answer=answer;liftCheck(q);}
 assert.equal(q.checked.length,Object.keys(liftCases).length);assert.equal(liftComplete(q),false);q.reflection='limited';assert.equal(liftComplete(q),true);const copy=liftRestore(q);copy.observed.pop();assert.equal(q.observed.length,9);assert.throws(()=>liftRestore({...q,last:{...q.last,correct:false}}),RangeError);assert.throws(()=>liftRestore({...q,checked:['common','common']}),RangeError);
});
