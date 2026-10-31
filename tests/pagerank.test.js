import test from 'node:test';
import assert from 'node:assert/strict';
import {pagerankCases,pagerankStep,pagerankHistory,createPagerank,pagerankCorrect,pagerankComplete,restorePagerank} from '../src/pagerank.js';
test('two PageRank steps preserve probability and give the intended ranks',()=>{
 for(const [id,expected] of Object.entries({east:[[25,25,25],[10,40,25],[10,31,34]],west:[[25,25,25],[25,40,10],[34,31,10]]})){
  const rows=pagerankHistory(id);rows.forEach((row,i)=>{row.forEach((n,j)=>assert.ok(Math.abs(n-expected[i][j]/75)<1e-12));assert.ok(Math.abs(row.reduce((a,b)=>a+b,0)-1)<1e-12);});
  let x=rows[2];for(let i=0;i<100;i++)x=pagerankStep(id,x);const next=pagerankStep(id,x);assert.ok(x.every((n,i)=>Math.abs(n-next[i])<1e-12));assert.ok(rows[2].some((n,i)=>Math.abs(n-x[i])>0.001));
 }
 assert.throws(()=>pagerankStep('east',[0,0,0]));assert.throws(()=>pagerankStep('bad',[1/3,1/3,1/3]));
});
test('both predictions and the distinction between iteration and convergence are required',()=>{
 const s=createPagerank();for(const id of Object.keys(pagerankCases)){const t=s.trials[id];t.stage=2;t.predictions=[1,id==='east'?2:0];t.reason='final';t.checked=true;assert.equal(pagerankCorrect(id,t),false);t.reason='iteration';assert.equal(pagerankCorrect(id,t),true);}
 assert.equal(pagerankComplete(s),true);assert.deepEqual(restorePagerank(s),s);const copy=restorePagerank(s);copy.trials.east.predictions[0]=0;assert.equal(pagerankComplete(copy),false);assert.equal(s.trials.east.predictions[0],1);assert.throws(()=>restorePagerank({...s,selected:'bad'}));
});
