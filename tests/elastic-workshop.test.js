import test from 'node:test';import assert from 'node:assert/strict';
import {elasticReplay,elasticCreate,elasticStep,elasticDone,elasticRestore} from '../src/elastic-workshop.js';
test('fixed and delayed adjustments count served, queue and worker periods',()=>{
 const fixed=elasticReplay('fixed',[2,2,2,2,2,2]);assert.deepEqual(fixed.rows.map(r=>r.waiting),[0,0,2,4,2,0]);assert.equal(fixed.cost,12);
 const flexible=elasticReplay('adjust',[1,3,3,3,1,1]);assert.deepEqual(flexible.rows.map(r=>r.available),[1,1,3,3,3,1]);assert.deepEqual(flexible.rows.map(r=>r.waiting),[0,0,0,0,0,0]);assert.equal(flexible.cost,12);
 assert.throws(()=>elasticReplay('fixed',[1]),RangeError);assert.throws(()=>elasticReplay('adjust',[0]),RangeError);
});
test('two completed comparisons, an increase, a decrease and the reflection are required',()=>{
 const q=elasticCreate();for(let i=0;i<6;i++)elasticStep(q);q.mode='adjust';for(const desired of [1,3,3,3,1,1]){q.desired=desired;elasticStep(q);}q.answer='delay';q.checked=true;assert.equal(elasticDone(q),true);
 const copy=elasticRestore(q);copy.requests.adjust[0]=2;assert.equal(q.requests.adjust[0],1);assert.throws(()=>elasticStep(q),RangeError);
 const flat=elasticRestore(q);flat.requests.adjust=[1,1,1,1,1,1];assert.equal(elasticDone(flat),false);
});
