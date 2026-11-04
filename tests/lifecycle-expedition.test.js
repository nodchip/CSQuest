import test from 'node:test';
import assert from 'node:assert/strict';
import {lifecycleCases,lifecycleStages,lifecycleExpeditionCreate,lifecycleExpeditionAttempt,lifecycleExpeditionDone,lifecycleExpeditionRestore} from '../src/lifecycle-expedition.js';
test('each scenario covers all five stages and rejects incorrect identification or action',()=>{
 for(const [id,c] of Object.entries(lifecycleCases)){
  assert.deepEqual(new Set(c.steps.map(s=>s.stage)),new Set(Object.keys(lifecycleStages)));
  const q=lifecycleExpeditionCreate();q.selected=id;
  for(const [i,s] of c.steps.entries()){
   q.stage=Object.keys(lifecycleStages).find(k=>k!==s.stage);q.choice=s.answer;assert.equal(lifecycleExpeditionAttempt(q).ok,false);assert.equal(q.actions[id].length,i);
   q.stage=s.stage;q.choice=Object.keys(s.choices).find(k=>k!==s.answer);assert.equal(lifecycleExpeditionAttempt(q).ok,false);assert.equal(q.actions[id].length,i);
   q.choice=s.answer;assert.equal(lifecycleExpeditionAttempt(q).ok,true);
  }
 }
});
test('both scenarios and reflection gate completion; only correct prefixes restore',()=>{
 const q=lifecycleExpeditionCreate();for(const [id,c] of Object.entries(lifecycleCases)){q.selected=id;for(const s of c.steps){q.stage=s.stage;q.choice=s.answer;assert.equal(lifecycleExpeditionAttempt(q).ok,true);}}
 assert.equal(lifecycleExpeditionDone(q),false);q.reflection='repeat';assert.equal(lifecycleExpeditionDone(lifecycleExpeditionRestore(q)),true);
 const copy=lifecycleExpeditionRestore(q);copy.actions.herbs.pop();assert.equal(q.actions.herbs.length,8);
 assert.throws(()=>lifecycleExpeditionRestore({...q,actions:{...q.actions,herbs:['private']}}),RangeError);
});
