import test from 'node:test';
import assert from 'node:assert/strict';
import {interviews,requirementClasses,requirementItems,behaviorClasses,behaviorItems,createRequirements,restoreRequirements,requirementsComplete} from '../src/requirements.js';

function solved(){const s=createRequirements();s.observed=Object.keys(interviews);for(const [id,item] of Object.entries(requirementItems))s.requirements[id]=item.answer;for(const [id,item] of Object.entries(behaviorItems))s.behaviors[id]=item.answer;s.checked=true;return s;}
test('completion requires all voices, a check and every correct classification',()=>{
  const s=solved();assert.equal(requirementsComplete(s),true);s.checked=false;assert.equal(requirementsComplete(s),false);s.checked=true;s.observed.pop();assert.equal(requirementsComplete(s),false);
  for(const [group,items,options] of [['requirements',requirementItems,requirementClasses],['behaviors',behaviorItems,behaviorClasses]])for(const [id,item] of Object.entries(items))for(const answer of Object.keys(options)){
    const candidate=solved();candidate[group][id]=answer;assert.equal(requirementsComplete(candidate),answer===item.answer);
  }
});
test('partial restoration copies answers and rejects impossible state',()=>{
  const s=createRequirements();s.observed=['traveler'];s.requirements.search='function';const restored=restoreRequirements(s);s.observed.push('keeper');assert.deepEqual(restored.observed,['traveler']);assert.equal(restored.requirements.search,'function');
  s.observed=['traveler','traveler'];assert.throws(()=>restoreRequirements(s),RangeError);s.observed=[];s.checked=true;assert.throws(()=>restoreRequirements(s),RangeError);
  const valid=solved();valid.behaviors.guest='invalid';assert.throws(()=>restoreRequirements(valid),RangeError);
});
