import test from 'node:test';
import assert from 'node:assert/strict';
import {periodQftState,periodQftCreate,periodQftCheck,periodQftSampleCheck,periodQftDone,periodQftRestore} from '../src/period-qft.js';
test('inverse QFT of each periodic conditional state has the expected peaks and phases',()=>{
 for(const [base,r] of [[2,4],[4,2]])for(let offset=0;offset<r;offset++){
  const state=periodQftState(base,offset);assert.equal(state.order,r);assert.equal(state.positions.length,16/r);
  for(let y=0;y<16;y++){const t=state.transformed[y],peak=y%(16/r)===0;assert.ok(Math.abs(t.p-(peak?1/r:0))<1e-12);
   if(peak){const angle=-2*Math.PI*offset*y/16;assert.ok(Math.abs(t.re-Math.cos(angle)/Math.sqrt(r))<1e-12);assert.ok(Math.abs(t.im-Math.sin(angle)/Math.sqrt(r))<1e-12);}}
 }
 assert.throws(()=>periodQftState(2,4),RangeError);
});
test('all six branches, partial and useful samples, and reflection gate completion',()=>{
 const q=periodQftCreate();q.phase='prepared';q.prediction='zero';assert.equal(periodQftCheck(q),false);
 for(const [b,r,answer] of [[2,4,'four'],[4,2,'eight']])for(let i=0;i<r;i++){q.base=b;q.offset=i;q.prediction=answer;assert.equal(periodQftCheck(q),true);}
 assert.equal(periodQftSampleCheck(q,0).verified,false);assert.equal(periodQftSampleCheck(q,8).verified,false);assert.equal(periodQftSampleCheck(q,4).verified,true);
 assert.equal(periodQftDone(q),false);q.reflection='peaks';assert.equal(periodQftDone(periodQftRestore(q)),true);
 const copy=periodQftRestore(q);copy.seen.pop();assert.equal(q.seen.length,6);assert.throws(()=>periodQftRestore({...q,offset:4}),RangeError);
});
