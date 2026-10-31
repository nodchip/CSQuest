import test from 'node:test';
import assert from 'node:assert/strict';
import {stewardshipResult,createStewardship,restoreStewardship,stewardshipComplete} from '../src/data-stewardship.js';
test('each fixed agreement has a different appropriate disclosure',()=>{
 for(const id of ['delivery','research','marketing'])for(const choice of ['hold','limited','full'])assert.equal(stewardshipResult(id,choice).success,id==='marketing'?choice==='hold':choice==='limited',`${id} ${choice}`);assert.throws(()=>stewardshipResult('delivery','unknown'));
});
test('all three decisions and the custody principle are required',()=>{const s=createStewardship();s.trials={delivery:'limited',research:'limited',marketing:'hold'};s.answer='custody';s.checked=true;assert.equal(stewardshipComplete(s),true);const copy=restoreStewardship(s);copy.trials.marketing='full';assert.equal(stewardshipComplete(copy),false);assert.equal(stewardshipComplete(s),true);assert.throws(()=>restoreStewardship({...s,selected:'other'}));});
