import test from 'node:test';
import assert from 'node:assert/strict';
import {oddEvenLabState} from '../src/odd-even-sort-lab.js';
import {createOddEven,restoreOddEven} from '../src/odd-even-sort.js';
test('all 5456 inputs of lengths two to six sort stably after n phases',()=>{for(let length=2;length<=6;length++)for(let n=0;n<4**length;n++){const values=Array.from({length},(_,i)=>Math.floor(n/4**i)%4),initial=oddEvenLabState(values,0).cards,result=oddEvenLabState(values,length);assert.ok(result.done);assert.deepEqual(result.cards,initial.toSorted((a,b)=>a.value-b.value));}});
test('experiment restores, validates steps and loads older drafts',()=>{const s=createOddEven();s.lab={values:[3,2,1],steps:2};assert.deepEqual(restoreOddEven(s),s);delete s.lab;assert.deepEqual(restoreOddEven(s).lab,{values:[3,1,3,0],steps:0});s.lab={values:[1,2],steps:3};assert.throws(()=>restoreOddEven(s));});
