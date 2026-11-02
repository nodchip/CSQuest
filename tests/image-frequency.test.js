import {test} from 'node:test';
import assert from 'node:assert/strict';
import {frequencyTransform,frequencyInverse,frequencyResult,frequencyCreate,frequencyApply,frequencyComplete,frequencyRestore} from '../src/image-frequency.js';

test('2D transform and inverse match explicit sums across 81 small images',()=>{
 for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++)for(let d=-1;d<=1;d++){
  const pixels=[a,b,c,d],expected=[a+b+c+d,a-b+c-d,a+b-c-d,a-b-c+d];assert.deepEqual(frequencyTransform(pixels),expected.map(x=>x||0));assert.deepEqual(frequencyInverse(expected).map(x=>x||0),pixels.map(x=>x||0));
 }
});
test('every mask produces the independent spatial combination and preserves signed values',()=>{
 for(const [id,pattern,bit] of [['checker',[1,-1,-1,1],8],['stripe',[1,1,-1,-1],4]])for(let mask=0;mask<16;mask++){
  const expected=pattern.map(x=>((mask&1)?2:0)+((mask&bit)?x:0));const actual=frequencyResult(id,mask).pixels;assert.deepEqual(actual,expected.map(x=>x||0));
 }
});
test('all four goals, retry after changing mask and restore validation',()=>{
 const q=frequencyCreate();for(const [i,bit] of [['checker',8],['stripe',4]])for(const g of ['smooth','detail']){
  q.image=i;q.goal=g;const t=q.trials[`${i}:${g}`];assert(!frequencyApply(q));t.mask=g==='smooth'?1:bit;t.observed=false;t.passed=false;assert(frequencyApply(q));assert.deepEqual(frequencyRestore(q),q);
 }assert(!frequencyComplete(q));q.answer='signed';assert(frequencyComplete(q));const bad=structuredClone(q);bad.trials['stripe:detail'].mask=15;assert.throws(()=>frequencyRestore(bad));
});
