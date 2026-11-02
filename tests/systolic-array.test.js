import test from 'node:test';
import assert from 'node:assert/strict';
import {systolicCases,systolicB,systolicFrame,systolicCreate,systolicRestore,systolicComplete} from '../src/systolic-array.js';
test('wavefront products meet matching indices and agree with matrix multiplication at every tick',()=>{
 for(const [id,c] of Object.entries(systolicCases))for(let tick=0;tick<=4;tick++){
  const f=systolicFrame(id,tick);let count=0;
  for(let i=0;i<c.a.length;i++)for(let j=0;j<2;j++){
   const expected=[0,1].filter(k=>i+j+k<tick).reduce((s,k)=>s+c.a[i][k]*systolicB[k][j],0);assert.equal(f.values[i][j],expected);
  }
  for(const [time,events] of f.history.entries())for(const e of events){assert.equal(time,e.row+e.col+e.k);assert.equal(e.product,c.a[e.row][e.k]*systolicB[e.k][e.col]);count++;}
  assert.equal(f.active,count);assert.equal(f.active+f.idle,tick*4);
 }
 assert.deepEqual(systolicFrame('full',4).values,[[5,4],[11,10]]);assert.deepEqual(systolicFrame('full',4).history.map(x=>x.length),[1,3,3,1]);
 assert.deepEqual(systolicFrame('single',4).history.map(x=>x.length),[1,2,1,0]);assert.equal(systolicFrame('single',4).idle,12);
});
test('restore validates progress and both observations plus reflections are necessary',()=>{
 const q=systolicCreate();q.ticks.full=2;assert.deepEqual(systolicRestore(q),q);assert.throws(()=>systolicRestore({...q,ticks:{...q.ticks,single:5}}));
 q.ticks.full=4;q.ticks.single=4;q.flow='neighbors';assert.equal(systolicComplete(q),false);q.padding='unused';assert.equal(systolicComplete(q),true);
});
