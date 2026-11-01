import {test} from 'node:test';
import assert from 'node:assert/strict';
import {averageCases,averageAccess,createAverage,averageComplete,restoreAverage} from '../src/average-access.js';
test('average time matches the weighted hit and miss times, including boundary rates',()=>{
 for(const c of Object.values(averageCases)){const weighted=(1-c.missRate)*c.hit+c.missRate*(c.hit+c.penalty);assert.equal(averageAccess(c.hit,c.missRate,c.penalty),weighted);}
 assert.equal(averageAccess(2,0,10),2);assert.equal(averageAccess(2,1,10),12);assert.throws(()=>averageAccess(1,1.1,5),RangeError);
 assert.deepEqual(Object.values(averageCases).map(c=>averageAccess(c.hit,c.missRate,c.penalty)),[3.5,3.25,4.5]);
});
test('all three checked values and a comparison are required and restored independently',()=>{
 const s=createAverage();s.answers={a:3.5,b:3.25,c:4.5};s.checked={a:true,b:true,c:true};s.comparison='b';assert.equal(averageComplete(s),false);s.confirmed=true;const copy=restoreAverage(s);s.answers.a=4.5;assert.equal(averageComplete(s),false);assert.equal(averageComplete(copy),true);assert.throws(()=>restoreAverage({...copy,answers:{...copy.answers,a:10}}),RangeError);
});
