import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRefactor,stepRefactor,testRefactor,refactorResult,refactorComplete,restoreRefactor} from '../src/rule-refactoring.js';
test('extracting a shared rule preserves boundaries, while an off-by-one refactoring fails',()=>{
 let s=createRefactor();s=stepRefactor(s,'shared3');s=stepRefactor(s,'screenShared');assert.deepEqual(refactorResult(s,'screen',2),{actual:false,expected:true});assert.deepEqual(refactorResult(s,'desk',2),{actual:true,expected:true});s=stepRefactor(s,'shared2');s=stepRefactor(s,'deskShared');s=stepRefactor(s,'remove');for(const c of ['screen','desk'])for(const n of [1,2,3])s=testRefactor(s,c,n);assert.equal(refactorComplete(s),true);s=stepRefactor(s,'shared3');assert.equal(refactorComplete(s),false);assert.equal(Object.values(s.tested).some(Boolean),false);
});
test('unsafe deletion is refused, history is replayed, and invalid actions are rejected',()=>{
 let s=createRefactor();s=stepRefactor(s,'remove');assert.equal(s.locals,true);s=stepRefactor(s,'shared2');s=stepRefactor(s,'screenShared');const copy=restoreRefactor({...s,shared:3});assert.equal(copy.shared,2);assert.equal(copy.source.screen,'shared');assert.throws(()=>restoreRefactor({history:[['action','bad']]}),RangeError);assert.throws(()=>restoreRefactor({history:[['test','screen',99]]}),RangeError);
});
