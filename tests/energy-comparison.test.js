import {parallelEnergyCases} from '../src/parallel-energy.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {energyMeasurement,energyBest,createEnergyComparison,energyComparisonCorrect,energyComparisonComplete,restoreEnergyComparison} from '../src/energy-comparison.js';

test('energy integrates the constant average power over the work and rankings depend on the metric',()=>{
  assert.deepEqual(['A','B','C'].map(id=>energyMeasurement('large',id).joules),[20,15,20]);
  assert.deepEqual(['A','B','C'].map(id=>energyMeasurement('small',id).joules),[8,9,10]);
  assert.deepEqual(energyBest('large','seconds'),['C']);assert.deepEqual(energyBest('large','watts'),['A']);assert.deepEqual(energyBest('large','joules'),['B']);assert.deepEqual(energyBest('small','joules'),['A']);
});
test('both comparisons require all measurements and correct selections',()=>{
  const s=createEnergyComparison();for(const [id,energy] of [['large','B'],['small','A']])Object.assign(s.trials[id],{visited:['A','B','C'],answers:{time:'C',power:'A',energy},checked:true});
  assert.equal(energyComparisonComplete(s),false);for(const id of Object.keys(parallelEnergyCases))s.parallel[id]={visited:[1,2,4],fast:'4',power:'1',energy:id==='short'?'2,4':'1,2',checked:true};
  assert.ok(energyComparisonComplete(s));assert.ok(energyComparisonComplete(restoreEnergyComparison(s)));const {parallel,...old}=s;assert.equal(energyComparisonComplete(restoreEnergyComparison(old)),false);
  assert.equal(energyComparisonCorrect({...s.trials.large,visited:['A','B']}),false);
  assert.throws(()=>restoreEnergyComparison({...s,trials:{...s.trials,large:{...s.trials.large,visited:['A','A']}}}));
});
