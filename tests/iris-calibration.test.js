import test from 'node:test';
import assert from 'node:assert/strict';
import {irisCalibrationResult,createIrisCalibration,irisCalibrationComplete,restoreIrisCalibration} from '../src/iris-calibration.js';

test('both held-out splits and all three temperatures preserve classifications and aggregate bins',()=>{
 const briers={validation:[.0356870261396545,.043729640255447746,.07947437250438465],test:[.03218099745865732,.027011902439333768,.041271838180867625]};
 for(const split of ['validation','test']){const outputs=[.5,1,2].map(t=>irisCalibrationResult(split,t));for(const [i,r] of outputs.entries()){
  assert.equal(r.total,20);assert.equal(r.correct,19);assert.ok(Math.abs(r.brier-briers[split][i])<1e-12);assert.equal(r.bins.reduce((a,b)=>a+b.count,0),20);assert.equal(r.bins.reduce((a,b)=>a+b.positive,0),10);assert.ok(Math.abs(r.brier-r.rows.reduce((a,x)=>a+(x.p-x.label)**2,0)/20)<1e-12);assert.deepEqual(r.rows.map(x=>x.prediction),outputs[1].rows.map(x=>x.prediction));
  for(const bin of r.bins){const group=r.rows.filter(x=>Math.min(3,Math.floor(x.p*4))===bin.index);assert.equal(bin.count,group.length);assert.equal(bin.positive,group.filter(x=>x.label).length);if(!bin.count)assert.equal(bin.mean,null);else assert.ok(Math.abs(bin.mean-group.reduce((a,x)=>a+x.p,0)/group.length)<1e-12);}
 }}
});
test('all six comparisons and the probability limitation are required',()=>{
 const s=createIrisCalibration();s.observed=['validation,0.5','validation,1','validation,2','test,0.5','test,1','test,2'];s.answer='probabilities';s.checked=true;const copy=restoreIrisCalibration(s);assert.equal(irisCalibrationComplete(copy),true);copy.observed.pop();assert.equal(s.observed.length,6);assert.equal(irisCalibrationComplete(copy),false);assert.throws(()=>restoreIrisCalibration({...s,observed:['test,1','test,1']}));
});
