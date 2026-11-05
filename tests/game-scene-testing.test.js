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
 const q=sceneTestingCreate();assert.throws(()=>sceneTestingRun(q,1));q.guess='safe';sceneTestingRun(q,1);assert.equal(q.guess,null);q.guess='safe';sceneTestingRun(q,2);assert.deepEqual(q.last,{wall:false,updates:2,guess:'safe'});q.wall=true;q.guess='safe';sceneTestingRun(q,1);q.answer='both';assert(!sceneTestingDone(q));q.guess='safe';sceneTestingRun(q,2);q.guess='cross';sceneTestingRun(q,2);assert(sceneTestingDone(q));assert.equal(q.seen.length,4);const restored=sceneTestingRestore(q);restored.seen.pop();restored.last.guess='safe';assert.equal(q.seen.length,4);assert.equal(q.last.guess,'cross');assert.throws(()=>sceneTestingRestore({...q,seen:['true:3']}));assert.throws(()=>sceneTestingRestore({...q,last:{wall:false,updates:3,guess:'safe'}}));
 const {guess,last,...legacy}=q;assert.equal(sceneTestingRestore(legacy).last,null);
 const {sceneTesting,...old}=loopTimeCreate();assert.deepEqual(loopTimeRestore(old),loopTimeCreate());
});
