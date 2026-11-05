import test from 'node:test';
import assert from 'node:assert/strict';
import {maybeLabState,createMaybeLab,restoreMaybeLab} from '../src/maybe-lab.js';
import {createExceptionRouting,restoreExceptionRouting} from '../src/exception-routing.js';
test('failure propagates without running the next operation while successful zero remains a value',()=>{assert.equal(maybeLabState(2,2).value,0);assert.equal(maybeLabState(1,1).value,0);assert.equal(maybeLabState(1,2).value,null);const r=maybeLabState(0,2);assert.equal(r.value,null);assert.match(r.trace[1],/実行しません/);assert.throws(()=>maybeLabState(3,2));});
test('old drafts acquire an independent exercise and partial progress is validated',()=>{const q=createExceptionRouting();delete q.maybe;assert.deepEqual(restoreExceptionRouting(q).maybe,createMaybeLab());const m=createMaybeLab();m.steps[1]=1;m.answer='absent';const restored=restoreMaybeLab(m);restored.steps[1]=2;assert.equal(m.steps[1],1);m.steps[2]=3;assert.throws(()=>restoreMaybeLab(m));});
