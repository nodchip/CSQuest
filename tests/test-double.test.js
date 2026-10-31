import {test} from 'node:test';
import assert from 'node:assert/strict';
import {doubleProcess,doubleRun,doubleObserved,createDouble,doubleComplete,restoreDouble} from '../src/test-double.js';
test('injected sender records success or failure, while invalid input never calls it',()=>{
 assert.deepEqual(doubleRun('valid','success'),{status:'ok',stock:1,calls:[2]});assert.deepEqual(doubleRun('valid','failure'),{status:'failure',stock:3,calls:[2]});for(const fake of ['success','failure'])assert.deepEqual(doubleRun('invalid',fake),{status:'invalid',stock:3,calls:[]});let calls=0;assert.deepEqual(doubleProcess(0,()=>calls++),{status:'invalid',stock:3});assert.equal(calls,0);assert.throws(()=>doubleRun('bad','success'),RangeError);
});
test('all three outcomes are required and history is validated and copied',()=>{
 const s=createDouble();s.history=[['valid','success'],['valid','failure'],['invalid','failure']];const copy=restoreDouble(s);assert.deepEqual(doubleObserved(copy),{success:true,failure:true,invalid:true});s.history[0][1]='failure';assert.equal(doubleComplete(copy),true);assert.equal(doubleComplete(s),false);assert.throws(()=>restoreDouble({...copy,history:[['invalid','bad']]}),RangeError);
});
