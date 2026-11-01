import test from 'node:test';
import assert from 'node:assert/strict';
import {sphericalMethods,sphericalSigns,sphericalSteps,sphericalSample,interpolateQuaternion,sphericalRequired,sphericalCreate,sphericalComplete,sphericalRestore} from '../src/spherical-rotation.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('unit quaternions, endpoints, shortest sign and slerp angular rate',()=>{for(const method of Object.keys(sphericalMethods))for(const step of sphericalSteps){const a=sphericalSample(method,'positive',step),b=sphericalSample(method,'negative',step);near(Math.hypot(...a.q),1);near(a.angle,b.angle);assert.equal(a.flipped,false);assert.equal(b.flipped,true);if(method==='slerp')near(a.angle,120*step/100);if(step===0)near(a.angle,0);if(step===100)near(a.angle,120);}near(sphericalSample('nlerp','positive',25).angle,2*Math.atan2(Math.sqrt(3),7)*180/Math.PI);assert.ok(sphericalSample('nlerp','positive',25).angle<30);assert.throws(()=>sphericalSample('bad','positive',25));});
test('eight observations and checked comparison are required and drafts validated',()=>{const s=sphericalCreate();s.answer='speed';s.checked=true;assert.equal(sphericalComplete(s),false);s.seen=[...sphericalRequired];assert.equal(sphericalComplete(s),true);const c=sphericalRestore(s);c.seen.pop();assert.equal(sphericalComplete(c),false);assert.equal(sphericalComplete(s),true);s.seen.push(s.seen[0]);assert.throws(()=>sphericalRestore(s));});

test('extra axes, same orientation, and deterministic 180-degree tie stay finite and preserve sign equivalence',()=>{
 for(const id of ['y120','x90','z180','same'])for(const method of Object.keys(sphericalMethods))for(const step of sphericalSteps){const a=sphericalSample(method,'positive',step,id),b=sphericalSample(method,'negative',step,id);near(Math.hypot(...a.q),1);for(let i=0;i<4;i++)near(a.q[i],b.q[i]);near(a.angle,b.angle);if(id==='same')near(a.angle,0);if(method==='slerp')near(a.angle,({y120:120,x90:90,z180:180,same:0}[id])*step/100);if(id==='z180')assert.equal(a.tie,true);}assert.equal(sphericalSample('slerp','negative',50,'z180').flipped,true);assert.equal(sphericalSample('slerp','positive',50,'z180').flipped,false);
});
test('generic interpolation handles arbitrary starting rotations and old drafts',()=>{
 const a=[Math.SQRT1_2,Math.SQRT1_2,0,0],b=[Math.SQRT1_2,0,Math.SQRT1_2,0],mid=interpolateQuaternion(a,b,.5,'slerp');near(Math.hypot(...mid.q),1);const dot=x=>x.reduce((sum,v,i)=>sum+v*mid.q[i],0);near(dot(a),dot(b));assert.throws(()=>interpolateQuaternion([0,0,0,0],b,.5,'slerp'));const old={method:'slerp',sign:'positive',step:25,seen:['slerp:positive:25'],answer:'',checked:false};assert.equal(sphericalRestore(old).scenario,'y120');assert.deepEqual(sphericalRestore({...old,scenario:'z180',seen:['z180:slerp:negative:50']}).seen,['z180:slerp:negative:50']);
});

test('near-coincident quaternions avoid division instability',()=>{
 const angle=1e-8,a=[1,0,0,0],b=[Math.cos(angle/2),0,Math.sin(angle/2),0];for(const t of [0,.25,.5,.75,1]){const v=interpolateQuaternion(a,b,t,'slerp').q;near(Math.hypot(...v),1);assert.ok(v.every(Number.isFinite));assert.ok(Math.abs(v[2]-t*angle/2)<1e-15);}
});
