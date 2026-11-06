import {test} from 'node:test';
import assert from 'node:assert/strict';
import {edgeValues,edgeAnswers,edgeIntersection,edgeCreate,edgeSetValue,edgeChoose,edgeCorrect,edgeCheck,edgeRestore} from '../src/edge-interpolation.js';

test('36 endpoint pairs yield a zero at the correct interpolated position or none',()=>{
 for(const a of edgeValues)for(const b of edgeValues){
  const result=edgeIntersection(a,b);assert(edgeAnswers.includes(result));
  if(Math.sign(a)===Math.sign(b))assert.equal(result,'none');
  else {const [n,d]=result.split('/').map(Number),t=n/d;assert(t>0&&t<1);assert(Math.abs((1-t)*a+t*b)<1e-12);const [rn,rd]=edgeIntersection(b,a).split('/').map(Number);assert(Math.abs(t+rn/rd-1)<1e-12);}
 }
 assert.equal(edgeIntersection(-1,3),'1/4');assert.equal(edgeIntersection(-3,1),'3/4');assert.equal(edgeIntersection(-2,3),'2/5');
 assert.throws(()=>edgeIntersection(0,1));
});
test('wrong choices can be corrected and drafts preserve independent checked pairs',()=>{
 const s=edgeCreate();assert.throws(()=>edgeCheck(s));edgeChoose(s,'1/2');assert.equal(edgeCheck(s),false);edgeChoose(s,'1/4');assert.equal(edgeCheck(s),true);assert(edgeCorrect(s));
 edgeSetValue(s,'b',-1);edgeChoose(s,'none');assert(edgeCheck(s));
 const copy=edgeRestore(s);copy.checked.pop();assert.equal(s.checked.length,2);
 assert.throws(()=>edgeRestore({...s,checked:['-1:3','-1:3']}));assert.throws(()=>edgeRestore({...s,feedback:true,guess:null}));
});
