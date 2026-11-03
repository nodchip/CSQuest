import test from 'node:test';
import assert from 'node:assert/strict';
import {numericMethods,numericCases,numericTest,numericCreate,numericRestore,numericDone} from '../src/numeric-testing.js';

test('each comparison observes the intended finite precision and special case behavior',()=>{
 const expected={exact:[false,false,false,false],absolute:[true,true,false,false],combined:[true,false,true,false]};
 for(const method of Object.keys(numericMethods))assert.deepEqual(numericCases.map(x=>numericTest(method,x)),expected[method]);
 assert.notEqual(0.1+0.2,0.3);
});
test('completion needs each distinct method and case, plus the context reflection',()=>{
 const q=numericCreate();q.passed=Object.keys(numericMethods).flatMap(m=>numericCases.map(c=>`${m}:${c.id}`));assert.equal(numericDone(q),false);q.reflection='context';assert.equal(numericDone(q),true);
 const copy=numericRestore(q);copy.passed.pop();assert.equal(q.passed.length,12);
 assert.throws(()=>numericRestore({...q,passed:[q.passed[0],q.passed[0]]}));assert.throws(()=>numericRestore({...q,passed:['exact:invalid']}));
});
