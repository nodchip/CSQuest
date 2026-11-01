import test from 'node:test';
import assert from 'node:assert/strict';
import {treePruningData,treePruningResult,createTreePruning,treePruningComplete,restoreTreePruning} from '../src/tree-pruning.js';

test('leaf predictions come from the training majority in all four comparisons',()=>{
 for(const pruned of [false,true])for(const split of ['train','validation']){
  const r=treePruningResult(pruned,split);for(const row of r.rows){const examples=treePruningData.train.filter(t=>t.warm===row.warm&&(pruned||!row.warm||(t.mark==='spiral')===(row.mark==='spiral')));assert.ok(examples.length);const majority=examples.filter(x=>x.label===1).length>examples.length/2?1:0;assert.equal(row.prediction,majority);}
  assert.equal(r.correct,r.rows.filter(row=>row.prediction===row.label).length);
 }
 assert.deepEqual([treePruningResult(false,'train').correct,treePruningResult(false,'validation').correct,treePruningResult(true,'train').correct,treePruningResult(true,'validation').correct],[6,3,5,4]);
});
test('both trees, both splits and the evaluation limitation are required',()=>{
 const s=createTreePruning();s.observed=['full,train','full,validation','pruned,train','pruned,validation'];s.answer='validation';s.checked=true;assert.equal(treePruningComplete(restoreTreePruning(s)),true);assert.equal(treePruningComplete({...s,answer:'always'}),false);assert.throws(()=>restoreTreePruning({...s,observed:['full,train','full,train']}));
});
