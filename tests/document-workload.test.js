import test from 'node:test';
import assert from 'node:assert/strict';
import {createDocumentWorkload,documentWorkloadStep,documentTotal,restoreDocumentWorkload} from '../src/document-workload.js';
import {createNosqlSet,restoreNosqlSet} from '../src/nosql-models.js';

test('updates, insertions, deletions and a refreshed summary preserve the expected totals',()=>{
 let q=createDocumentWorkload();assert.equal(documentTotal(q.documents),10);
 for(const [action,total] of [['update',11],['insert',13],['remove',12]]){const r=documentWorkloadStep(q,action);assert.equal(r.ok,true);q=r.state;assert.equal(documentTotal(q.documents),total);assert.equal(q.summary,10);}
 assert.equal(documentWorkloadStep(q,'insert').ok,false);
 q=documentWorkloadStep(q,'refresh').state;assert.equal(q.summary,12);assert.equal(documentTotal(q.documents),12);
});
test('every order of the three independent changes has the same final records',()=>{
 const permute=a=>a.length?a.flatMap((x,i)=>permute([...a.slice(0,i),...a.slice(i+1)]).map(rest=>[x,...rest])):[[]];
 for(const actions of permute(['update','insert','remove'])){
  let q=createDocumentWorkload();for(const action of actions){const r=documentWorkloadStep(q,action);assert.equal(r.ok,true);q=r.state;}
  assert.deepEqual(q.documents.map(d=>[d.id,d.delivery.count]),[['A',2],['B',4],['D',4],['E',2]]);
  assert.equal(documentTotal(q.documents),12);assert.equal(q.summary,10);
 }
});
test('replay restores drafts without trusting saved records and rejects invalid histories',()=>{
 const q=createNosqlSet(),old={selected:'kv',histories:{kv:[],document:[]},formats:q.formats,schema:q.schema,choices:q.choices,archive:q.archive,archivePrefix:q.archivePrefix,nested:q.nested,dictionary:q.dictionary};
 assert.deepEqual(restoreNosqlSet(old).workload,createDocumentWorkload());
 const saved=documentWorkloadStep(createDocumentWorkload(),'update').state;saved.guess=11;saved.checked=true;old.workload=saved;
 assert.deepEqual(restoreNosqlSet(old).workload,saved);
 assert.throws(()=>restoreDocumentWorkload({...saved,history:['remove','remove']}));
 assert.throws(()=>restoreDocumentWorkload({...saved,guess:null,checked:true}));
});
