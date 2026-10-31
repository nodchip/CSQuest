import test from 'node:test';
import assert from 'node:assert/strict';
import {trainingCrystals,testCrystals,predictCrystal,evaluateCrystals,createOverfit,restoreOverfit,overfitTrialsComplete,overfitComplete} from '../src/overfit.js';
test('memory fits all training records but defaults to the training majority on unseen identifiers',()=>{
  assert.equal(trainingCrystals.filter(x=>x.label==='blue').length,4);assert.ok(testCrystals.every(x=>!trainingCrystals.some(y=>y.id===x.id)));assert.equal(evaluateCrystals('memory','training').correct,6);assert.equal(evaluateCrystals('memory','test').correct,2);assert.ok(testCrystals.every(x=>predictCrystal('memory',x)==='blue'));
});
test('the warmth rule misses the contradictory training record and matches the four held-out examples',()=>{
  assert.deepEqual(evaluateCrystals('rule','training').rows.filter(x=>!x.correct).map(x=>x.id),['C']);assert.equal(evaluateCrystals('rule','test').correct,4);
});
test('all four checked results and the evidence-limited conclusion are required',()=>{
  const s=createOverfit();for(const m of ['memory','rule'])for(const set of ['training','test'])s.trials[m][set]={prediction:evaluateCrystals(m,set).correct,checked:true};assert.equal(overfitTrialsComplete(restoreOverfit(s)),true);s.conclusion='training';assert.equal(overfitComplete(s),false);s.conclusion='limited';assert.equal(overfitComplete(s),true);s.trials.rule.test.prediction=5;assert.equal(overfitComplete(s),false);
  assert.throws(()=>restoreOverfit({...s,conclusion:'unknown'}),RangeError);
});
