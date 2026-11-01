import test from 'node:test';
import assert from 'node:assert/strict';
import {irisPartition} from '../src/iris-learning.js';
import {irisCurveSizes,irisCurveSubset,evaluateIrisCurve,irisCurveRequired,createIrisCurve,irisCurveComplete,restoreIrisCurve} from '../src/iris-curve.js';

test('subsets are balanced, nested and exclude validation and test',()=>{
 const parts=irisPartition();
 for(const order of ['front','back']) for(const n of irisCurveSizes){
  const rows=irisCurveSubset(order,n);
  assert.equal(rows.length,n);assert.equal(rows.filter(r=>r[2]===0).length,n/2);
  assert.ok(rows.every(r=>parts.train.includes(r)&&!parts.validation.includes(r)&&!parts.test.includes(r)));
  if(n>4){const previous=irisCurveSizes[irisCurveSizes.indexOf(n)-1];assert.ok(irisCurveSubset(order,previous).every(r=>rows.includes(r)));}
 }
 assert.deepEqual(irisCurveSubset('front',60),irisCurveSubset('back',60));
 assert.throws(()=>irisCurveSubset('front',3));assert.throws(()=>irisCurveSubset('other',8));
});
test('learning curve counts match independently checked examples',()=>{
 const expected={threshold:[[4,14],[8,14],[16,17],[29,18],[56,18]],nearest:[[4,15],[8,15],[16,19],[32,19],[60,19]]};
 for(const method of Object.keys(expected)) irisCurveSizes.forEach((n,i)=>{const r=evaluateIrisCurve('front',method,n);assert.deepEqual([r.trainCorrect,r.validationCorrect],expected[method][i]);});
 assert.equal(evaluateIrisCurve('back','threshold',8).validationCorrect,16);
 assert.equal(evaluateIrisCurve('back','nearest',8).validationCorrect,17);
 assert.throws(()=>evaluateIrisCurve('front','invalid',4));
});
test('completion requires all requested observations and the limited conclusion',()=>{
 const s=createIrisCurve();s.observed=[...irisCurveRequired];s.answer='limited';assert.equal(irisCurveComplete(s),false);s.checked=true;assert.equal(irisCurveComplete(s),true);
 s.observed.pop();assert.equal(irisCurveComplete(s),false);assert.deepEqual(restoreIrisCurve(s),s);
 assert.throws(()=>restoreIrisCurve({...s,observed:['front:nearest:8','front:nearest:8']}));
 assert.throws(()=>restoreIrisCurve({...s,observed:['front:nearest:08']}));
});
