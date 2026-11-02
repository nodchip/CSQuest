import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ewasteStats,ewasteCreate,ewasteView,ewasteComplete,ewasteRestore} from '../src/ewaste-report.js';

test('published rounded mass figures are compared without assigning an unrecorded fate',()=>{
 assert.deepEqual(ewasteStats('2010'),{generated:34,documented:8,other:26,rate:23.5});
 assert.deepEqual(ewasteStats('2022'),{generated:62,documented:13.8,other:48.2,rate:22.3});
 const old=ewasteStats('2010'),current=ewasteStats('2022');assert.equal(current.generated-old.generated,28);assert.ok(Math.abs(current.documented-old.documented-5.8)<1e-9);assert.throws(()=>ewasteStats('2030'));
});
test('both reports and all three conclusions required; saved choices validated and copied',()=>{
 let q=ewasteCreate();ewasteView(q);ewasteView(q);q.selected='2022';ewasteView(q);assert.deepEqual(q.viewed,['2010','2022']);q.answers={growth:'generated',unknown:'discarded',health:'risk'};assert.equal(ewasteComplete(q),false);q.answers.unknown='uncertain';assert.equal(ewasteComplete(q),true);let copy=ewasteRestore(q);copy.answers.health='none';copy.viewed.pop();assert.equal(ewasteComplete(copy),false);assert.equal(ewasteComplete(q),true);assert.throws(()=>ewasteRestore({...q,viewed:['2022','2022']}));assert.throws(()=>ewasteRestore({...q,answers:{...q.answers,health:'bad'}}));
});
