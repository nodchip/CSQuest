import test from 'node:test';
import assert from 'node:assert/strict';
import {rotationCases,rotationMethods,rotationSteps,rotationSample,createRotationInterpolation,rotationInterpolationComplete,restoreRotationInterpolation} from '../src/rotation-interpolation.js';
test('wrapped angles and half-turn tie follow the specified continuous paths',()=>{
 const values=(id,m)=>rotationSteps.map(t=>rotationSample(id,m,t).angle);
 assert.deepEqual(values('wrap','direct'),[350,265,180,95,10]);assert.deepEqual(values('wrap','shortest'),[350,355,0,5,10]);
 assert.deepEqual(values('half','direct'),[0,45,90,135,180]);assert.deepEqual(values('half','shortest'),[0,315,270,225,180]);
 assert.equal(rotationSample('wrap','shortest',4).unwrapped,370);assert.equal(rotationSample('half','shortest',0).delta,-180);assert.throws(()=>rotationSample('wrap','shortest',5));
});
test('comparison observations and qualified conclusion are required',()=>{
 const s=createRotationInterpolation();s.observed=Object.keys(rotationCases).flatMap(id=>Object.keys(rotationMethods).flatMap(m=>[1,2,3].map(t=>`${id}:${m}:${t}`)));s.answer='direction';s.checked=true;assert.ok(rotationInterpolationComplete(s));assert.deepEqual(restoreRotationInterpolation(s),s);s.observed.pop();assert.equal(rotationInterpolationComplete(s),false);assert.throws(()=>restoreRotationInterpolation({...s,observed:['wrap:direct:2','wrap:direct:2']}));
});
