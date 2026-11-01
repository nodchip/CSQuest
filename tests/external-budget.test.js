import test from 'node:test';
import assert from 'node:assert/strict';
import {budgetCases,externalBudget,createExternalBudget,externalBudgetComplete,restoreExternalBudget} from '../src/external-budget.js';

test('budget matches independently grouped page runs for many capacities',()=>{
  for(let pages=1;pages<=24;pages++)for(let buffers=3;buffers<=6;buffers++){
    let runs=[];for(let p=0;p<pages;p+=buffers)runs.push(Math.min(buffers,pages-p));
    const levels=[runs.length];let io=pages*2;
    while(runs.length>1){const next=[];for(let i=0;i<runs.length;i+=buffers-1)next.push(runs.slice(i,i+buffers-1).reduce((a,b)=>a+b,0));runs=next;levels.push(runs.length);io+=pages*2;}
    assert.deepEqual(externalBudget(pages,buffers),{runs:levels[0],merges:levels.length-1,io,levels});
  }
  assert.throws(()=>externalBudget(8,2));assert.throws(()=>externalBudget(0,3));
});
test('four checked estimates, including one initial run, are required and restored',()=>{
  const s=createExternalBudget(),answers={fits:[1,0,8],small:[3,2,48],medium:[3,1,48],large:[6,3,128]};
  for(const [id,[runs,merges,io]] of Object.entries(answers))s.choices[id]={runs,merges,io,checked:true};
  assert.equal(externalBudgetComplete(s),true);const copy=restoreExternalBudget(s);copy.choices.fits.io=16;assert.equal(externalBudgetComplete(copy),false);assert.equal(s.choices.fits.io,8);
  for(const id of Object.keys(budgetCases)){const changed=structuredClone(s);changed.choices[id].checked=false;assert.equal(externalBudgetComplete(changed),false);}
  assert.throws(()=>restoreExternalBudget({...s,choices:{...s.choices,fits:{...s.choices.fits,io:999}}}));
});
