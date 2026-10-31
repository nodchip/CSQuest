import test from 'node:test';
import assert from 'node:assert/strict';
import {rescueRun,createRescue,restoreRescue,rescueComplete} from '../src/evaluation-rescue.js';
test('unused nonterminating argument and repeated pure or stateful argument have distinct outcomes',()=>{
 assert.equal(rescueRun('endless','value').result,null);for(const mode of ['name','need'])assert.equal(rescueRun('endless',mode).result,5);
 assert.deepEqual(['value','name','need'].map(m=>rescueRun('shared',m).calculations),[1,2,1]);assert.deepEqual(['value','name','need'].map(m=>rescueRun('counter',m).result),[2,3,2]);
 assert.throws(()=>rescueRun('endless','other'));
});
test('completion checks each requirement and draft restoration is isolated',()=>{
 const s=createRescue();s.trials={endless:'need',shared:'need',counter:'name'};s.checked=true;assert.equal(rescueComplete(s),true);const copy=restoreRescue(s);copy.trials.counter='value';assert.equal(rescueComplete(copy),false);assert.equal(rescueComplete(s),true);assert.throws(()=>restoreRescue({...s,trials:{...s.trials,counter:'x'}}));
});
