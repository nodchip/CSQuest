import test from 'node:test';
import assert from 'node:assert/strict';
import {logisticWorkshopData,logisticWorkshopMetrics,logisticWorkshopTrace,createLogisticWorkshop,logisticWorkshopComplete,restoreLogisticWorkshop} from '../src/logistic-workshop.js';

test('objective gradients match central differences for every dataset and regularization',()=>{
 for(const data of Object.keys(logisticWorkshopData))for(const lambda of [0,.2])for(const [w,b] of [[0,0],[.4,-.2],[1.1,.3]]){
  const h=1e-6,m=logisticWorkshopMetrics(data,lambda,w,b),f=(a,c)=>logisticWorkshopMetrics(data,lambda,a,c).objective;
  assert.ok(Math.abs(m.dw-(f(w+h,b)-f(w-h,b))/(2*h))<1e-8);assert.ok(Math.abs(m.db-(f(w,b+h)-f(w,b-h))/(2*h))<1e-8);assert.ok(m.rows.every(r=>r.p>0&&r.p<1));
 }
});
test('all four histories use simultaneous gradient descent and lower their own objectives',()=>{
 for(const data of Object.keys(logisticWorkshopData))for(const lambda of [0,.2]){const h=logisticWorkshopTrace(data,lambda,6);assert.equal(h.length,7);assert.ok(Math.abs(h[0].logLoss-Math.log(2))<1e-12);for(let i=1;i<h.length;i++){assert.ok(Math.abs(h[i].w-(h[i-1].w-.5*h[i-1].dw))<1e-12);assert.ok(Math.abs(h[i].b-(h[i-1].b-.5*h[i-1].db))<1e-12);assert.ok(h[i].objective<=h[i-1].objective+1e-12);}}
 assert.ok(logisticWorkshopTrace('ordered',0,6).at(-1).w>logisticWorkshopTrace('ordered',.2,6).at(-1).w);
});
test('all four histories must finish and survive restoration',()=>{
 const s=createLogisticWorkshop();for(const k of Object.keys(s.steps))s.steps[k]=6;s.answer='limited';s.checked=true;const copy=restoreLogisticWorkshop(s);assert.equal(logisticWorkshopComplete(copy),true);copy.steps['mixed,0']=2;assert.equal(s.steps['mixed,0'],6);assert.equal(logisticWorkshopComplete(copy),false);assert.throws(()=>restoreLogisticWorkshop({...s,steps:{...s.steps,'mixed,0':7}}));
});
