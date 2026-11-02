import test from 'node:test';
import assert from 'node:assert/strict';
import {objectiveCases,objectiveReplay,objectiveStep,objectivesCreate,objectivesRestore,objectivesComplete} from '../src/test-objectives.js';

test('each objective needs observation, failure judgment, matching repair and passing retest',()=>{
 const q=objectivesCreate();
 for(const id of Object.keys(objectiveCases)){
  let h=[];assert.equal(objectiveStep(id,h,'judge:fail').ok,false);
  h=objectiveStep(id,h,'run').history;assert.equal(objectiveStep(id,h,'judge:pass').ok,false);
  h=objectiveStep(id,h,'judge:fail').history;const wrong=Object.keys(objectiveCases).find(x=>x!==id);assert.equal(objectiveStep(id,h,`fix:${wrong}`).ok,false);
  h=objectiveStep(id,h,`fix:${id}`).history;assert.equal(objectiveStep(id,h,'judge:pass').ok,false);
  h=objectiveStep(id,h,'run').history;assert.equal(objectiveStep(id,h,'judge:fail').ok,false);h=objectiveStep(id,h,'judge:pass').history;
  assert.equal(objectiveReplay(id,h).passed,true);q.trials[id]=h;
 }
 assert.equal(objectivesComplete(q),false);q.reflection='scope';assert.equal(objectivesComplete(q),true);const copy=objectivesRestore(q);copy.trials.usability.pop();assert.equal(objectivesComplete(copy),false);assert.equal(objectivesComplete(q),true);
});
test('replay rejects wrong order, wrong fixes and forged completion',()=>{
 assert.throws(()=>objectiveReplay('usability',['judge:pass']));assert.throws(()=>objectiveReplay('usability',['run','judge:fail','fix:security']));
 const q=objectivesCreate();q.trials.usability=['run','judge:pass'];assert.throws(()=>objectivesRestore(q));
});
