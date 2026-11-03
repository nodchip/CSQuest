import test from 'node:test';
import assert from 'node:assert/strict';
import {characteristicCases,characteristicCoefficients,characteristicCreate,characteristicResult,characteristicDone,characteristicRestore} from '../src/characteristic-mirror.js';

test('coefficients agree with direct determinants for small integer matrices',()=>{
 for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)for(let c=-2;c<=2;c++)for(let d=-2;d<=2;d++)for(let x=-3;x<=3;x++){
  const [p,q]=characteristicCoefficients([[a,b],[c,d]]);
  assert.ok(x*x+p*x+q===(x-a)*(x-d)-b*c);
 }
});
test('four mirrors distinguish repeated roots from independent directions',()=>{
 const expected={distinct:{b:-3,c:2,roots:[1,2],directions:2},shear:{b:-2,c:1,roots:[1],directions:1},identity:{b:-2,c:1,roots:[1],directions:2},turn:{b:0,c:1,roots:[],directions:0}};
 const q=characteristicCreate();
 for(const [id,answer] of Object.entries(expected)){
  assert.equal(characteristicResult(id,answer).correct,true);
  assert.equal(characteristicResult(id,{...answer,directions:(answer.directions+1)%3}).correct,false);
  assert.equal(characteristicResult(id,{...answer,b:answer.b+1}).correct,false);
  assert.equal(characteristicResult(id,{...answer,roots:[...answer.roots,0]}).correct,false);
  q.trials[id]={...answer,roots:[...answer.roots],checked:true};
 }
 assert.equal(characteristicDone(q),true);
 assert.deepEqual(Object.keys(characteristicCases),Object.keys(expected));
 const copied=characteristicRestore(q);copied.trials.distinct.roots.push(0);assert.deepEqual(q.trials.distinct.roots,[1,2]);
 q.trials.shear.roots=[1,1];assert.throws(()=>characteristicRestore(q));
});
