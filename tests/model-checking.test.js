import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createModelCheck,expandModel,modelCheckComplete,restoreModelCheck} from '../src/model-checking.js';
test('finite breadth-first exploration finds a simultaneous entry only when check and entry are separate',()=>{
 const s=createModelCheck();for(const mode of ['split','atomic'])while(s.trials[mode].status==='searching')s.trials[mode]=expandModel(s.trials[mode]);assert.equal(s.trials.split.status,'violation');assert.deepEqual(s.trials.split.counterexample.path,['A：外 → 確認後','B：外 → 確認後','A：確認後 → 部屋の中','B：確認後 → 部屋の中']);assert.equal(s.trials.atomic.status,'safe');assert.equal(s.trials.atomic.seen.includes('2,2'),false);assert.equal(modelCheckComplete(s),true);
});
test('saved exploration is reconstructed, cannot run beyond exhaustion, and ignores forged states',()=>{
 const s=createModelCheck();s.trials.split=expandModel(s.trials.split);const copy=restoreModelCheck({...s,trials:{...s.trials,split:{steps:1,status:'violation'}}});assert.equal(copy.trials.split.status,'searching');assert.deepEqual(copy.trials.split.seen,['0,0','1,0','0,1']);assert.throws(()=>restoreModelCheck({...s,trials:{...s.trials,split:{steps:31}}}),RangeError);
});
