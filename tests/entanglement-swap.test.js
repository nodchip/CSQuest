import test from 'node:test';
import assert from 'node:assert/strict';
import {swapOutcomes,swapBranch,swapCorrect,swapCorrelations,swapCreate,swapCheck,swapDone,swapRestore} from '../src/entanglement-swap.js';
test('four Bell measurement branches are equally likely and average to a maximally mixed pair',()=>{
 const rho=Array.from({length:4},()=>Array(4).fill(0));
 for(const bits of swapOutcomes){const {probability,vector}=swapBranch(bits);assert.ok(Math.abs(probability-.25)<1e-12);
  const before=swapCorrelations(vector);assert.ok(Math.abs(before.zz-(bits[1]==='0'?1:-1))<1e-12);assert.ok(Math.abs(before.xx-(bits[0]==='0'?1:-1))<1e-12);
  const after=swapCorrelations(swapCorrect(vector,bits[1]==='1',bits[0]==='1'));assert.ok(Math.abs(after.zz-1)<1e-12&&Math.abs(after.xx-1)<1e-12);
  for(let i=0;i<4;i++)for(let j=0;j<4;j++)rho[i][j]+=probability*vector[i]*vector[j];
 }
 for(let i=0;i<4;i++)for(let j=0;j<4;j++)assert.ok(Math.abs(rho[i][j]-(i===j?.25:0))<1e-12);
});
test('measurement results must be delivered and all four corrected branches plus reflection are required',()=>{
 const q=swapCreate();assert.throws(()=>swapCheck(q),RangeError);
 for(const bits of swapOutcomes){q.selected=bits;q.phase='delivered';q.x=bits[1]==='1';q.z=bits[0]==='1';assert.equal(swapCheck(q).correct,true);}
 assert.equal(swapDone(q),false);q.reflection='classical';assert.equal(swapDone(swapRestore(q)),true);
 const c=swapRestore(q);c.solved.pop();assert.equal(q.solved.length,4);
 assert.throws(()=>swapRestore({...q,phase:'ready',x:true}),RangeError);
});
