import test from 'node:test';
import assert from 'node:assert/strict';
import {makeSeal,captureSeal,createClosureTrial,checkClosures,createClosures,restoreClosures,closuresComplete} from '../src/closures.js';

test('factory calls retain distinct parameter bindings when the caller changes its setting',()=>{
  let dial=2;const old=makeSeal(dial);dial=3;const recent=makeSeal(dial);dial=1;
  assert.equal(old(4),8);assert.equal(recent(4),12);assert.throws(()=>makeSeal(0),RangeError);
});
test('two cases require captured factors and predictions to match',()=>{
  const state=createClosures();state.trials.first={dial:3,old:2,recent:3,predOld:8,predRecent:12,tested:true};state.trials.second={dial:1,old:3,recent:1,predOld:9,predRecent:3,tested:true};
  assert.equal(closuresComplete(state),true);state.trials.first.predOld=12;assert.equal(checkClosures('first',state.trials.first).oldPrediction,false);assert.equal(closuresComplete(state),false);
});
test('recapturing clears dependent work and restoration rejects impossible seals',()=>{
  let trial=createClosureTrial();assert.throws(()=>captureSeal(trial,'recent'),RangeError);trial=captureSeal({...trial,dial:2},'old');trial=captureSeal({...trial,dial:3},'recent');
  assert.deepEqual([trial.old,trial.recent],[2,3]);trial=captureSeal({...trial,dial:1},'old');assert.equal(trial.recent,null);
  const saved=createClosures();saved.trials.first=trial;const restored=restoreClosures(saved);saved.trials.first.old=3;assert.equal(restored.trials.first.old,1);
  restored.trials.first.old=null;restored.trials.first.recent=3;assert.throws(()=>restoreClosures(restored),RangeError);
});
