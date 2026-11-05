import test from 'node:test';
import assert from 'node:assert/strict';
import {continuationValue,createContinuationLab,restoreContinuationLab} from '../src/continuation-lab.js';
import {createExceptionRouting,restoreExceptionRouting} from '../src/exception-routing.js';
test('saved remaining steps can be applied to two values and order changes results',()=>{assert.deepEqual([1,2].map(v=>continuationValue('addFirst',v)),[9,12]);assert.deepEqual([1,2].map(v=>continuationValue('multiplyFirst',v)),[5,8]);assert.throws(()=>continuationValue('unknown',1));});
test('previous quest drafts gain a continuation exercise and new records are validated',()=>{const q=createExceptionRouting();delete q.continuation;assert.deepEqual(restoreExceptionRouting(q).continuation,createContinuationLab());const c=createContinuationLab();c.saved='addFirst';c.seen=['addFirst:1'];c.last='addFirst:1';const r=restoreContinuationLab(c);r.seen.push('addFirst:2');assert.deepEqual(c.seen,['addFirst:1']);assert.throws(()=>restoreContinuationLab({...c,last:'multiplyFirst:2'}));});
