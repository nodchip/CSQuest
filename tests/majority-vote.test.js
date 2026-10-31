import {test} from 'node:test';
import assert from 'node:assert/strict';
import {majorityDecision,majorityCases,createMajority,majorityComplete,restoreMajority} from '../src/majority-vote.js';
test('majority rules may return an incorrect unanimous or two-vote value and hold on a three-way split',()=>{
 assert.deepEqual(Object.keys(majorityCases).map(majorityDecision),['three','two','hold','two']);assert.equal(majorityCases.second.truth,3);assert.equal(majorityCases.fourth.truth,3);assert.throws(()=>majorityDecision('bad'),RangeError);
});
test('all checked votes are required and saved records are independent',()=>{
 const s=createMajority();for(const id of Object.keys(majorityCases))s[id]={choice:majorityDecision(id),checked:true};const copy=restoreMajority(s);s.third.choice='three';assert.equal(majorityComplete(copy),true);assert.equal(majorityComplete(s),false);assert.throws(()=>restoreMajority({...copy,first:{choice:'bad',checked:true}}),RangeError);
});
