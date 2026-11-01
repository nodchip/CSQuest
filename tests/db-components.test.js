import test from 'node:test';
import assert from 'node:assert/strict';
import {dbComponents,componentTasks,createComponents,componentCorrect,componentsComplete,restoreComponents} from '../src/db-components.js';
import {createIndexPlan,restoreIndexPlan} from '../src/index-plan.js';

test('every task requires its checked matching role',()=>{
 const s=createComponents();
 for(const id of Object.keys(componentTasks)){
  for(const role of Object.keys(dbComponents)){s.answers[id]=role;s.checked[id]=true;assert.equal(componentCorrect(s,id),role===id);}
  s.answers[id]=id;
 }
 assert.equal(componentsComplete(s),true);
 const copy=restoreComponents(s);copy.answers.analysis='planner';assert.equal(s.answers.analysis,'analysis');assert.equal(componentsComplete(copy),false);
 assert.throws(()=>restoreComponents({...s,answers:{...s.answers,storage:'unknown'}}));
});
test('earlier query drafts preserve trials and acquire fresh role choices',()=>{
 const {components,...old}=createIndexPlan();old.trials.both.tested=['scan'];
 const r=restoreIndexPlan(old);assert.deepEqual(r.trials.both.tested,['scan']);assert.deepEqual(r.components,createComponents());
});
