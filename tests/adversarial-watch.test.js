import test from 'node:test';
import assert from 'node:assert/strict';
import {watchModes,watchCases,watchResult,createAdversarialWatch,watchTrialComplete,adversarialWatchComplete,restoreAdversarialWatch} from '../src/adversarial-watch.js';
test('nearest examples and deterministic ties give the expected predictions',()=>{
 assert.deepEqual(Object.keys(watchCases).map(id=>watchResult('trusted',id).prediction),['safe','attack','safe']);
 assert.deepEqual(Object.keys(watchCases).map(id=>watchResult('mixed',id).prediction),['safe','safe','safe']);
 assert.equal(watchResult('mixed','attack').nearest,'Ｅ');assert.equal(watchResult('trusted','evasion').nearest,'Ａ');
 for(const m of Object.keys(watchModes))for(const k of Object.keys(watchCases)){const r=watchResult(m,k);assert.equal(r.distances.find(x=>x.name===r.nearest).distance,Math.min(...r.distances.map(x=>x.distance)));assert.equal(watchTrialComplete(m,k,{guess:r.prediction,checked:true}),true);}
});
test('all observations, correct predictions, and reflection are required',()=>{const s=createAdversarialWatch();for(const m of Object.keys(watchModes))for(const k of Object.keys(watchCases))s.trials[m][k]={guess:watchResult(m,k).prediction,checked:true};s.answer='limits';s.checked=true;assert.equal(adversarialWatchComplete(s),true);const r=restoreAdversarialWatch(s);r.trials.mixed.attack.guess='attack';assert.equal(s.trials.mixed.attack.guess,'safe');assert.equal(adversarialWatchComplete(r),false);assert.throws(()=>restoreAdversarialWatch({...s,sample:'invalid'}));});
