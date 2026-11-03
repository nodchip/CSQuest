import test from 'node:test';
import assert from 'node:assert/strict';
import {shapleyOrders,shapleyReplay,shapleyCreate,shapleyAverage,shapleyDone,shapleyRestore} from '../src/shapley-lab.js';
const expected={ABC:[2,4,3],ACB:[2,3,4],BAC:[2,4,3],BCA:[2,1,6],CAB:[1,4,4],CBA:[1,2,6]};
test('all orders produce independently calculated marginal changes and the same total',()=>{
 for(const o of shapleyOrders){const h=[...o].map((feature,i)=>({feature,guess:expected[o][i]}));const r=shapleyReplay(o,h);assert.deepEqual(r.steps.map(s=>s.delta),expected[o]);assert.equal(r.score,9);assert.equal(r.steps.reduce((a,s)=>a+s.delta,0),9);for(let i=0;i<3;i++)assert.equal(shapleyReplay(o,h.slice(0,i)).done,false);}
 assert.throws(()=>shapleyReplay('ABC',[{feature:'A',guess:3}]));assert.throws(()=>shapleyReplay('ABC',[{feature:'B',guess:2}]));
});
test('all six orders are needed for average and both reflections for completion',()=>{
 const q=shapleyCreate();for(const o of shapleyOrders)q.histories[o]=[...o].map((feature,i)=>({feature,guess:expected[o][i]}));assert.deepEqual(shapleyAverage(q.histories),{A:4,B:3,C:2});
 for(const o of shapleyOrders){const h={...q.histories,[o]:q.histories[o].slice(0,2)};assert.equal(shapleyAverage(h),null);}
 assert.equal(shapleyDone(q),false);q.reflection='average';q.causal='not-causal';assert.equal(shapleyDone(q),true);assert.equal(shapleyDone({...q,causal:'causal'}),false);assert.equal(shapleyDone({...q,reflection:'single'}),false);
});
test('partial progress is copied and corrupted history is rejected',()=>{
 const q=shapleyCreate();q.histories.ABC=[{feature:'A',guess:2}];const r=shapleyRestore(q);r.histories.ABC[0].guess=0;assert.equal(q.histories.ABC[0].guess,2);q.histories.ABC[0].guess=0;assert.throws(()=>shapleyRestore(q));
});
