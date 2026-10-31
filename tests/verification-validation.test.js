import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verifyResult,createVerify,stepVerify,verifyComplete,restoreVerify} from '../src/verification-validation.js';
test('specification conformance and user need are distinct in all four configurations',()=>{
 for(const spec of ['batch','live'])for(const implementation of ['batch','live']){const s={spec,implementation};assert.equal(verifyResult(s,'spec').pass,spec===implementation);assert.equal(verifyResult(s,'need').pass,implementation==='live');}assert.throws(()=>verifyResult({spec:'bad',implementation:'live'},'need'),RangeError);
});
test('the gap must be observed, then the revised specification and implementation retested',()=>{
 let s=createVerify();for(const action of ['check:spec','check:need'])s=stepVerify(s,action);assert.equal(s.seenGap,true);s=stepVerify(s,'spec');assert.equal(s.tested.spec,false);s=stepVerify(s,'implementation');for(const action of ['check:spec','check:need'])s=stepVerify(s,action);assert.equal(verifyComplete(s),true);assert.equal(verifyComplete(restoreVerify({...s,seenGap:false})),true);assert.throws(()=>restoreVerify({history:['check:bad']}),RangeError);
});
