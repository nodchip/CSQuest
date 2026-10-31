import test from 'node:test';
import assert from 'node:assert/strict';
import {workingPages,workingCases,createWorkingTrial,workingNeedsVictim,workingStep,createWorkingSet,workingComplete,restoreWorkingSet} from '../src/working-set.js';
test('two LRU frames fault on every reference, three frames only on the first visits',()=>{
 for(const [id,faults] of [['two',9],['three',3]]){let s=createWorkingTrial(id);while(s.index<workingPages.length){const action=workingNeedsVictim(s)?`victim:${s.order[0]}`:'read';s=workingStep(s,action);}assert.equal(s.faults,faults);assert.ok(s.order.length<=workingCases[id].capacity);}
});
test('incorrect victim does not advance and histories restore',()=>{
 const all=createWorkingSet();for(const id of Object.keys(workingCases)){let s=all.trials[id];while(s.index<workingPages.length){if(workingNeedsVictim(s)){const bad=workingStep(s,`victim:${s.order.at(-1)}`);assert.equal(bad.index,s.index);}s=workingStep(s,workingNeedsVictim(s)?`victim:${s.order[0]}`:'read');}all.trials[id]=s;}assert.equal(workingComplete(all),true);const saved={selected:'two',histories:{two:all.trials.two.history,three:all.trials.three.history}};assert.equal(workingComplete(restoreWorkingSet(saved)),true);assert.throws(()=>restoreWorkingSet({selected:'two',histories:{two:['victim:A'],three:[]}}),RangeError);
});
