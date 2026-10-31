import test from 'node:test';
import assert from 'node:assert/strict';
import {fairnessModes,fairnessMetrics,fairnessData,fairnessFraction,fairnessEqual,fairnessCorrect,createFairness,restoreFairness,fairnessComplete} from '../src/fairness.js';

test('both matrices conserve each group and yield the intended exact fractions',()=>{
 for(const mode of Object.keys(fairnessModes))for(const group of ['east','west']){const d=fairnessData[mode][group];assert.equal(d.tp+d.fn+d.fp+d.tn,10);assert.equal(d.tp+d.fn,group==='east'?8:4);assert.equal(d.fp+d.tn,group==='east'?2:6);}
 assert.deepEqual(['tpr','fpr','ppv'].map(m=>fairnessEqual('errors',m)),[true,true,false]);assert.deepEqual(['tpr','fpr','ppv'].map(m=>fairnessEqual('precision',m)),[true,false,true]);assert.deepEqual(fairnessFraction('errors','east','ppv'),{num:6,den:7});assert.deepEqual(fairnessFraction('precision','west','ppv'),{num:3,den:4});
});
test('each metric requires its selected rows and exact comparison, with safe draft restoration',()=>{
 const state=createFairness();for(const mode of Object.keys(fairnessModes))for(const [metric,m] of Object.entries(fairnessMetrics)){const c=state.choices[mode][metric];c.numerator=m.numerator.slice();c.denominator=m.denominator.slice();c.comparison=fairnessEqual(mode,metric)?'equal':'different';c.checked=true;assert.equal(fairnessCorrect(mode,metric,c),true);}
 assert.equal(fairnessComplete(state),true);const saved=restoreFairness(state);state.choices.errors.tpr.numerator.pop();assert.equal(saved.choices.errors.tpr.numerator.length,1);assert.equal(fairnessComplete(state),false);assert.throws(()=>restoreFairness({...saved,slot:'bad'}),RangeError);
});
