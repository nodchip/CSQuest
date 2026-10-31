import test from 'node:test';
import assert from 'node:assert/strict';
import {effectModes,effectResult,createEffect,effectCorrect,effectComplete,restoreEffect} from '../src/shared-side-effect.js';
test('two calls distinguish shared mutation from explicit input',()=>{
 assert.deepEqual([effectResult('shared',1),effectResult('shared',2)],[{input:2,result:3,shared:3},{input:3,result:4,shared:4}]);
 assert.deepEqual([effectResult('argument',1),effectResult('argument',2)],[{input:2,result:3,shared:2},{input:2,result:3,shared:2}]);
 assert.throws(()=>effectResult('shared',3));assert.throws(()=>effectResult('bad',1));
});
test('both predictions and a suitable repair are needed',()=>{
 const s=createEffect();for(const mode of Object.keys(effectModes)){const t=s.trials[mode];t.step=2;t.predictions=[effectResult(mode,1).result,effectResult(mode,2).result];t.checked=true;assert.equal(effectCorrect(mode,t),true);}s.repair='shared';s.finalChecked=true;assert.equal(effectComplete(s),false);s.repair='argument';assert.equal(effectComplete(s),true);assert.deepEqual(restoreEffect(s),s);const copy=restoreEffect(s);copy.trials.shared.predictions[1]=3;assert.equal(effectComplete(copy),false);assert.equal(s.trials.shared.predictions[1],4);assert.throws(()=>restoreEffect({...s,mode:'bad'}));
});
