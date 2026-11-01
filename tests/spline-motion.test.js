import test from 'node:test';
import assert from 'node:assert/strict';
import {splineCases,splineMethods,splinePosition,createSplineMotion,splineMotionComplete,restoreSplineMotion} from '../src/spline-motion.js';
test('uniform Catmull-Rom passes through endpoints and can overshoot equal keys',()=>{
 const t=[0,.25,.5,.75,1];assert.deepEqual(t.map(x=>splinePosition('ramp','linear',x)),[0,.25,.5,.75,1]);assert.deepEqual(t.map(x=>splinePosition('ramp','catmull',x)),[0,.203125,.5,.796875,1]);
 assert.deepEqual(t.map(x=>splinePosition('plateau','linear',x)),[1,1,1,1,1]);assert.deepEqual(t.map(x=>splinePosition('plateau','catmull',x)),[1,1.09375,1.125,1.09375,1]);
 for(const id of Object.keys(splineCases))for(const method of Object.keys(splineMethods)){const p=splineCases[id].points;assert.equal(splinePosition(id,method,0),p[1]);assert.equal(splinePosition(id,method,1),p[2]);}
 assert.throws(()=>splinePosition('plateau','catmull',NaN));assert.throws(()=>splinePosition('ramp','bad',.5));
});
test('spline agrees with independent Hermite basis and centered tangents',()=>{
 for(const id of Object.keys(splineCases)){const [p0,p1,p2,p3]=splineCases[id].points,m1=(p2-p0)/2,m2=(p3-p1)/2;for(let i=0;i<=100;i++){const t=i/100,t2=t*t,t3=t2*t,expected=(2*t3-3*t2+1)*p1+(t3-2*t2+t)*m1+(-2*t3+3*t2)*p2+(t3-t2)*m2;assert.ok(Math.abs(splinePosition(id,'catmull',t)-expected)<1e-12);}}
});
test('observations and the overshoot conclusion are necessary and restored',()=>{
 const s=createSplineMotion();s.observed=Object.keys(splineCases).flatMap(id=>Object.keys(splineMethods).flatMap(m=>[1,2,3].map(t=>`${id}:${m}:${t}`)));s.answer='overshoot';s.checked=true;assert.ok(splineMotionComplete(s));assert.deepEqual(restoreSplineMotion(s),s);s.observed.pop();assert.equal(splineMotionComplete(s),false);assert.throws(()=>restoreSplineMotion({...s,observed:['ramp:linear:1','ramp:linear:1']}));
});
