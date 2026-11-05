import test from 'node:test';
import assert from 'node:assert/strict';
import {scrollFilesCreate,scrollFilesAct,scrollFilesDone,scrollFilesRestore} from '../src/scroll-pipeline.js';
import {createScroll,restoreScroll} from '../src/scroll-pipeline.js';
test('the output needs a successful read, and denied writes preserve the existing report',()=>{const q=scrollFilesCreate();scrollFilesAct(q,'write');assert.equal(q.last,'need');assert.equal(q.protected,7);scrollFilesAct(q,'read');scrollFilesAct(q,'write');assert.equal(q.last,'denied');assert.equal(q.protected,7);assert.equal(q.work,1);assert(!scrollFilesDone(q));q.destination='work';scrollFilesAct(q,'write');assert.equal(q.last,'saved');assert.equal(q.work,3);assert(scrollFilesDone(q));assert.deepEqual(scrollFilesRestore(q),q);});
test('legacy drafts gain a fresh file exercise and invalid records are rejected',()=>{const {files,...old}=createScroll();assert.deepEqual(restoreScroll(old),createScroll());assert.throws(()=>scrollFilesRestore({...files,saved:true}));assert.throws(()=>scrollFilesRestore({...files,protected:3}));assert.throws(()=>scrollFilesAct(files,'bogus'));});
