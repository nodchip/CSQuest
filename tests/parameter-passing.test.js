import test from 'node:test';
import assert from 'node:assert/strict';
import {parameterModes,parameterReceipts,parameterResult,createParameter,parameterCorrect,parameterComplete,restoreParameter} from '../src/parameter-passing.js';
test('copy, reference, and receiving the returned value have distinct effects',()=>{
 const expected={value:{discard:[2,2],assign:[2,5]},reference:{discard:[5,5],assign:[5,5]}};
 for(const [mode,receipts] of Object.entries(expected))for(const [receipt,values] of Object.entries(receipts)){const r=parameterResult(mode,receipt);assert.deepEqual([r.afterCall,r.afterReceipt],values);assert.equal(r.returned,5);}
 assert.throws(()=>parameterResult('bad','assign'));
});
test('all four checked predictions are needed and draft restoration copies state',()=>{
 const s=createParameter();for(const mode of Object.keys(parameterModes))for(const receipt of Object.keys(parameterReceipts)){const r=parameterResult(mode,receipt);s.trials[mode][receipt]={afterCall:r.afterCall,afterReceipt:r.afterReceipt,checked:true};assert.equal(parameterCorrect(mode,receipt,s.trials[mode][receipt]),true);}assert.equal(parameterComplete(s),true);assert.deepEqual(restoreParameter(s),s);const copy=restoreParameter(s);copy.trials.value.discard.afterCall=5;assert.equal(parameterComplete(copy),false);assert.equal(s.trials.value.discard.afterCall,2);assert.throws(()=>restoreParameter({...s,mode:'bad'}));
});
