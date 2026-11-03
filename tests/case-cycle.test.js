import test from 'node:test';
import assert from 'node:assert/strict';
import {caseRecall,caseCycleCreate,caseCycleAct,caseCycleRestore,caseCycleDone} from '../src/case-cycle.js';
const act=(s,a)=>{const r=caseCycleAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('known observations affect retrieval and returned records do not mutate the casebook',()=>{
 assert.deepEqual(caseRecall(false,null).map(x=>x.id),['old']);assert.deepEqual(caseRecall(false,true),[]);assert.deepEqual(caseRecall(true,true).map(x=>x.id),['new']);assert.deepEqual(caseRecall(true,false).map(x=>x.id),['old']);
 const cases=caseRecall(true,true);cases[0].repairs.pop();assert.deepEqual(caseRecall(true,true)[0].repairs,['lamp','bell']);
});
test('retrieve reuse revise retain and reuse in a later case',()=>{
 let s=caseCycleCreate();assert.equal(caseCycleAct(s,'retain').ok,false);
 for(const a of ['retrieve','reuse','probe','retrieve','repair:bell','repair:lamp','retain','next','probe','retrieve','repair:lamp','repair:bell','answer:verify'])s=act(s,a);
 assert.equal(caseCycleDone(s),true);assert.deepEqual(caseCycleRestore(JSON.parse(JSON.stringify(s))),s);
});
test('out of order or forged history is rejected',()=>{
 for(const history of [['reuse'],['probe'],['retrieve','reuse','repair:lamp'],['next'],[null],Array(65).fill('retrieve')])assert.throws(()=>caseCycleRestore({history}));
});
