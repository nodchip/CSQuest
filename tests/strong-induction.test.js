import test from 'node:test';
import assert from 'node:assert/strict';
import {createStrongInduction,inductionBuild,inductionLengths,strongInductionComplete,restoreStrongInduction} from '../src/strong-induction.js';
test('build earlier lengths first and apply the strong induction choices',()=>{let s=createStrongInduction();assert.equal(inductionBuild(s,7,2),null);for(const [target,piece] of [[4,2],[5,2],[6,3],[7,2]])s=inductionBuild(s,target,piece);assert.deepEqual(inductionLengths(s),[2,3,4,5,6,7]);s.answers={base:'twoThree',step:'earlier'};s.checked=true;assert.equal(strongInductionComplete(s),true);assert.deepEqual(restoreStrongInduction(s),s);});
test('independent alternative construction and forged history',()=>{let s=createStrongInduction();s=inductionBuild(s,6,3);assert.ok(s);s=inductionBuild(s,4,2);s=inductionBuild(s,7,3);s=inductionBuild(s,5,3);assert.ok(s);assert.equal(inductionBuild(s,4,2),null);assert.throws(()=>restoreStrongInduction({...s,history:[[7,2]]}));});
