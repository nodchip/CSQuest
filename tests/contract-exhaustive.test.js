import {test} from 'node:test';
import assert from 'node:assert/strict';
import {exhaustiveActual,exhaustiveExpected,exhaustiveMatches,createExhaustive,stepExhaustive,exhaustiveComplete,restoreExhaustive} from '../src/contract-exhaustive.js';
test('only both guards satisfy all 16 specified input pairs although the sample passes all designs',()=>{
 for(const positive of [false,true])for(const inclusive of [false,true]){const rules={positive,inclusive};assert.equal(exhaustiveMatches(rules,3,1),true);let pass=true;for(let stock=0;stock<=3;stock++)for(let amount=0;amount<=3;amount++)pass=exhaustiveMatches(rules,stock,amount)&&pass;assert.equal(pass,positive&&inclusive);}assert.deepEqual(exhaustiveExpected(2,2),{status:'ok',remaining:0});assert.deepEqual(exhaustiveActual({positive:false,inclusive:true},2,0),{status:'ok',remaining:2});assert.throws(()=>exhaustiveExpected(4,1),RangeError);
});
test('a counterexample and an exhaustive successful repair are required and restored by replay',()=>{
 let s=createExhaustive();s=stepExhaustive(s,'sample');s=stepExhaustive(s,'row');assert.equal(s.seenMismatch,true);s=stepExhaustive(s,'positive');s=stepExhaustive(s,'inclusive');for(let i=0;i<4;i++)s=stepExhaustive(s,'row');assert.equal(exhaustiveComplete(s),true);const copy=restoreExhaustive({...s,rules:{positive:false,inclusive:false}});assert.equal(exhaustiveComplete(copy),true);assert.throws(()=>restoreExhaustive({history:['invalid']}),RangeError);
});
