import test from 'node:test';
import assert from 'node:assert/strict';
import {guideKinds,visitorCases,overloadResult,createOverload,overloadTrialPass,overloadComplete,restoreOverload} from '../src/overload-dispatch.js';

test('overload uses declared argument type and override uses actual receiver type',()=>{
 const expected={base:{baseBase:['base','base'],baseFire:['base','base'],fireFire:['fire','base']},fire:{baseBase:['base','fire'],baseFire:['base','fire'],fireFire:['fire','fire']}};
 for(const [g,cases] of Object.entries(expected))for(const [v,[parameter,implementation]] of Object.entries(cases))assert.deepEqual(overloadResult(g,v),{parameter,implementation});
 assert.throws(()=>overloadResult('unknown','baseBase'));assert.throws(()=>overloadResult('base','unknown'));
});
test('all six checked predictions and reflection are necessary and restored independently',()=>{
 const s=createOverload();for(const g of Object.keys(guideKinds))for(const v of Object.keys(visitorCases)){const {parameter,implementation}=overloadResult(g,v);s.trials[g][v]={parameter,implementation,checked:true};assert.equal(overloadTrialPass(s,g,v),true);}s.answer='two';s.checked=true;assert.ok(overloadComplete(s));const r=restoreOverload(s);r.trials.fire.baseFire.parameter='fire';assert.equal(s.trials.fire.baseFire.parameter,'base');assert.equal(overloadComplete(r),false);assert.throws(()=>restoreOverload({...s,trials:{...s.trials,base:{...s.trials.base,baseBase:{parameter:null,implementation:'base',checked:true}}}}));
});
