import test from 'node:test';
import assert from 'node:assert/strict';
import {orderBases,modularPower,orderExperiment,orderSample,createQuantumOrder,quantumOrderComplete,restoreQuantumOrder} from '../src/quantum-order.js';
test('all units modulo 15 and periods match independent modular enumeration',()=>{
 for(const a of orderBases){let value=1,first=null;for(let n=1;n<=16;n++){value=value*a%15;assert.equal(modularPower(a,n),value);if(value===1&&first===null)first=n;}assert.equal(orderExperiment(a).order,first);}
 assert.equal(orderExperiment(2).order,4);assert.equal(orderExperiment(14).order,2);
});
test('ideal discrete Fourier probabilities agree with a direct complex amplitude sum for every base and outcome',()=>{
 for(const a of orderBases){const {order,outcomes}=orderExperiment(a),L=16/order;
  for(let y=0;y<16;y++){let re=0,im=0;for(let j=0;j<L;j++){const angle=2*Math.PI*j*order*y/16;re+=Math.cos(angle);im+=Math.sin(angle);}const p=(re*re+im*im)/(16*L);assert.ok(Math.abs(p-(outcomes.includes(y)?1/order:0))<1e-12);}
 }
});
test('zero, incomplete denominator, trivial factor and nontrivial factors remain distinct',()=>{
 assert.equal(orderSample(2,0).denominator,1);assert.equal(orderSample(2,8).verified,false);
 assert.deepEqual(orderSample(14,8).factors,[1,15]);assert.equal(orderSample(14,8).nontrivial,false);
 assert.deepEqual(orderSample(2,4).factors,[3,5]);assert.ok(orderSample(2,4).nontrivial);
 assert.throws(()=>orderSample(2,1));
 const s=createQuantumOrder();s.observed=['zero','partial','trivial','factors'];s.answer='quantum';s.checked=true;assert.ok(quantumOrderComplete(restoreQuantumOrder(s)));
 assert.throws(()=>restoreQuantumOrder({...s,outcome:1}));
});
