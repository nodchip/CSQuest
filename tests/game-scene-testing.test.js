import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneTestingCreate,sceneTestingResult,sceneTestingRun,sceneTestingDone,sceneTestingRestore} from '../src/game-scene-testing.js';
import {loopTimeCreate,loopTimeRestore} from '../src/game-loop-time.js';

test('a passing first test misses the wall defect and a second test finds it',()=>{
 assert.deepEqual(sceneTestingResult(false,1),{position:2,passes:true});
 assert.deepEqual(sceneTestingResult(false,2),{position:4,passes:false});
 assert.deepEqual(sceneTestingResult(true,1),{position:2,passes:true});
 assert.deepEqual(sceneTestingResult(true,2),{position:2,passes:true});
 assert.throws(()=>sceneTestingResult(true,3));
});
test('each version and test is recorded, restored, and needed for reflection',()=>{
 const q=sceneTestingCreate();sceneTestingRun(q,1);sceneTestingRun(q,2);q.wall=true;sceneTestingRun(q,1);q.answer='both';assert(!sceneTestingDone(q));sceneTestingRun(q,2);sceneTestingRun(q,2);assert(sceneTestingDone(q));assert.equal(q.seen.length,4);const restored=sceneTestingRestore(q);restored.seen.pop();assert.equal(q.seen.length,4);assert.throws(()=>sceneTestingRestore({...q,seen:['true:3']}));
 const {sceneTesting,...old}=loopTimeCreate();assert.deepEqual(loopTimeRestore(old),loopTimeCreate());
});
