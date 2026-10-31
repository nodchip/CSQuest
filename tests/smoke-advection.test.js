import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advectRow,createAdvection,advectionStep,advectionComplete,restoreAdvection} from '../src/smoke-advection.js';

test('one exact shift and two half-cell backtraces produce independently calculated rows',()=>{
 const first=[0,0,4,0,0,0],whole=[0,0,0,4,0,0],half=[0,0,2,2,0,0],twice=[0,0,1,2,1,0];
 assert.deepEqual(advectRow(first,1),whole);assert.deepEqual(advectRow(first,.5),half);assert.deepEqual(advectRow(half,.5),twice);
 assert.equal(whole.reduce((a,b)=>a+b),4);assert.equal(twice.reduce((a,b)=>a+b),4);assert.equal(Math.max(...twice),2);assert.equal(Math.max(...whole),4);
});
test('incorrect predictions do not advance and saved rows must replay correctly',()=>{
 const s=createAdvection();assert.equal(advectionStep(s.trials.whole,[0,0,4,0,0,0]).history.length,0);s.trials.whole=advectionStep(s.trials.whole,[0,0,0,4,0,0]);
 s.trials.half=advectionStep(s.trials.half,[0,0,2,2,0,0]);s.trials.half=advectionStep(s.trials.half,[0,0,1,2,1,0]);assert.equal(advectionComplete(s),true);
 const saved={selected:'half',trials:Object.fromEntries(Object.entries(s.trials).map(([id,t])=>[id,{history:t.history,guess:t.guess}]))};assert.equal(advectionComplete(restoreAdvection(saved)),true);saved.trials.half.history[0]=[0,0,0,0,0,0];assert.throws(()=>restoreAdvection(saved),RangeError);
});
