import test from 'node:test';
import assert from 'node:assert/strict';
import {multiCases,multiModes,multiSchedule,createMultiprocessorRoles,multiRolesComplete,restoreMultiprocessorRoles} from '../src/multiprocessor-roles.js';
test('fixed setup costs, parallel work and failed controller give expected results',()=>{
 assert.equal(multiSchedule('small','asymmetric').time,2);assert.equal(multiSchedule('small','symmetric').time,3);
 assert.equal(multiSchedule('large','asymmetric').time,4);assert.equal(multiSchedule('large','symmetric').time,3);
 assert.deepEqual(multiSchedule('failure','asymmetric'),{completed:false,time:null,workers:0,setup:0});assert.equal(multiSchedule('failure','symmetric').time,5);
 assert.throws(()=>multiSchedule('bad','symmetric'));assert.throws(()=>multiSchedule('small','bad'));
});
test('both modes in each case and supported selections are needed',()=>{
 const s=createMultiprocessorRoles();s.observed=Object.keys(multiCases).flatMap(id=>Object.keys(multiModes).map(m=>`${id}:${m}`));s.best={small:'asymmetric',large:'symmetric',failure:'symmetric'};s.answer='tradeoff';s.checked=true;assert.ok(multiRolesComplete(s));assert.deepEqual(restoreMultiprocessorRoles(s),s);s.best.failure='asymmetric';assert.equal(multiRolesComplete(s),false);assert.throws(()=>restoreMultiprocessorRoles({...s,observed:['bad']}));
});
