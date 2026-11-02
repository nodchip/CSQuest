import {test} from 'node:test';
import assert from 'node:assert/strict';
import {smokeProject,smokeAdvect,smokeReplay,smokeLabCreate,smokeLabStep,smokeLabComplete,smokeLabRestore} from '../src/smoke-workshop.js';

test('projection removes divergence, preserves circulation, and is idempotent for 625 fields',()=>{
 for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)for(let c=-2;c<=2;c++)for(let d=-2;d<=2;d++){
  const before=[a,b,c,d],r=smokeProject(before),k=(a-b+c-d)/4;assert.deepEqual(r.after.map(v=>v===0?0:v),[k,-k,k,-k].map(v=>v===0?0:v));assert.ok(r.afterDivergence.every(v=>v===0));assert.deepEqual(smokeProject(r.after).after,r.after);assert.ok(r.after.reduce((s,v)=>s+v*v,0)<=before.reduce((s,v)=>s+v*v,0));
  const [p0,p1,p2,p3]=r.pressure,gradient=[p1-p0,p2-p0,p3-p1,p3-p2];assert.deepEqual(before.map((v,i)=>v-gradient[i]).map(v=>v===0?0:v),r.after);
 }
});
test('two distinct winds advect injected smoke with expected bilinear interpolation and replay',()=>{
 assert.deepEqual(smokeProject([2,0,0,0]).after,[.5,-.5,.5,-.5]);assert.deepEqual(smokeAdvect([2,0,0,0],[1,-1,1,-1]),[1,1,0,0]);
 let q=smokeLabCreate();smokeLabStep(q,'step');assert.equal(smokeReplay(q.history).frame,0);for(const a of ['emit:A','wind:spin','step','emit:D','wind:push','step'])smokeLabStep(q,a);let s=smokeReplay(q.history);assert.deepEqual(s.density,[.75,1,.5,1.75]);assert.deepEqual(s.last.projection.afterDivergence,[0,0,0,0]);assert.equal(smokeLabComplete(q),false);q.answer='projection';assert.equal(smokeLabComplete(q),true);const copy=smokeLabRestore(q);copy.history.pop();assert.equal(smokeLabComplete(q),true);assert.equal(smokeLabComplete(copy),false);assert.throws(()=>smokeLabRestore({...q,history:['emit:Z']}));assert.throws(()=>smokeLabRestore({...q,history:Array(61).fill('step')}));
});
