import test from 'node:test';
import assert from 'node:assert/strict';
import {bezierCases,bezierHeights,bezierGeometry,bezierCorrect,createBezier,restoreBezier,bezierComplete} from '../src/bezier.js';
test('midpoint equals weighted quadratic interpolation for all controls',()=>{
 for(const h of bezierHeights){const g=bezierGeometry(h);assert.equal(g.q0.x,(g.p0.x+g.p1.x)/2);assert.equal(g.q1.x,(g.p1.x+g.p2.x)/2);assert.equal(g.middle.x,(g.p0.x+2*g.p1.x+g.p2.x)/4);assert.equal(g.middle.y,(g.p0.y+2*g.p1.y+g.p2.y)/4);}
 for(const [id,item] of Object.entries(bezierCases)){const heights=bezierHeights.filter(height=>bezierCorrect(id,{height,checked:true}));assert.deepEqual(heights,[item.target*2]);}
});
test('all three checked controls required; restored drafts are validated',()=>{
 const s=createBezier();for(const [id,item] of Object.entries(bezierCases))s.choices[id]={height:item.target*2,checked:true};assert.equal(bezierComplete(s),true);const copy=restoreBezier(s);s.choices.high.height=0;assert.equal(bezierComplete(s),false);assert.equal(copy.choices.high.height,4);copy.choices.high.height=7;assert.throws(()=>restoreBezier(copy),RangeError);
});
