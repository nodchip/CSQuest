import test from 'node:test';
import assert from 'node:assert/strict';
import {bezierCases,bezierHeights,bezierGeometry,bezierParameters,bezierAt,bezierCorrect,createBezier,restoreBezier,bezierComplete} from '../src/bezier.js';
test('midpoint equals weighted quadratic interpolation for all controls',()=>{
 for(const h of bezierHeights){const g=bezierGeometry(h);assert.equal(g.q0.x,(g.p0.x+g.p1.x)/2);assert.equal(g.q1.x,(g.p1.x+g.p2.x)/2);assert.equal(g.middle.x,(g.p0.x+2*g.p1.x+g.p2.x)/4);assert.equal(g.middle.y,(g.p0.y+2*g.p1.y+g.p2.y)/4);}
 for(const [id,item] of Object.entries(bezierCases)){const heights=bezierHeights.filter(height=>bezierCorrect(id,{height,checked:true}));assert.deepEqual(heights,[item.target*2]);}
});
test('Bernstein weights reconstruct points at every available parameter',()=>{
 for(const h of bezierHeights)for(const t of bezierParameters){const r=bezierAt(h,t);assert.equal(r.weights.reduce((a,b)=>a+b,0),1);assert.ok(r.weights.every(n=>n>=0));assert.deepEqual(r.point,[4*t,2*t*(1-t)*h]);if(t===0.5)assert.deepEqual(r.point,[bezierGeometry(h).middle.x,bezierGeometry(h).middle.y]);}
 assert.throws(()=>bezierAt(2,2),RangeError);const old=createBezier();delete old.parameter;assert.equal(restoreBezier(old).parameter,0.5);old.parameter=0.3;assert.throws(()=>restoreBezier(old),RangeError);
});
test('all three checked controls required; restored drafts are validated',()=>{
 const s=createBezier();for(const [id,item] of Object.entries(bezierCases))s.choices[id]={height:item.target*2,checked:true};assert.equal(bezierComplete(s),true);const copy=restoreBezier(s);s.choices.high.height=0;assert.equal(bezierComplete(s),false);assert.equal(copy.choices.high.height,4);copy.choices.high.height=7;assert.throws(()=>restoreBezier(copy),RangeError);
});
