import test from 'node:test';
import assert from 'node:assert/strict';
import {callbackModes,callbackOrder,callbackResult,createCallbackSigns,callbackTest,callbackSignsComplete,restoreCallbackSigns} from '../src/callback-signs.js';
test('callbacks use the current shared binding or a per-registration binding',()=>{
 for(let n=1;n<=3;n++)for(let i=0;i<n;i++){
  assert.equal(callbackResult('shared',n,callbackOrder[i]),callbackOrder[n-1]);
  assert.equal(callbackResult('separate',n,callbackOrder[i]),callbackOrder[i]);
 }
 assert.throws(()=>callbackResult('shared',1,'sun'));
});
test('both sets of correct callbacks and a reflection are required and restored',()=>{
 let s=createCallbackSigns();s.trials.shared.registered=3;s.trials.shared.sign='moon';s.trials.shared.guess='moon';assert.deepEqual(callbackTest(s).trials.shared.tested,[]);
 for(const mode of Object.keys(callbackModes)){s.mode=mode;s.trials[mode].registered=3;for(const sign of callbackOrder){s.trials[mode].sign=sign;s.trials[mode].guess=callbackResult(mode,3,sign);s=callbackTest(s);}}
 s.answer='binding';s.checked=true;assert.ok(callbackSignsComplete(restoreCallbackSigns(s)));
 assert.throws(()=>restoreCallbackSigns({...s,trials:{...s.trials,shared:{...s.trials.shared,registered:1}}}));
});
