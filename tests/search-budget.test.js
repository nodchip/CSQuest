import test from 'node:test';
import assert from 'node:assert/strict';
import {searchStats,createIterative,restoreIterative} from '../src/iterative-deepening.js';
import {budgetChoice,createSearchBudget,budgetComplete,restoreSearchBudget} from '../src/search-budget.js';

test('frontier capacity filters feasible searches before comparing inspections',()=>{
 assert.deepEqual(searchStats,{breadth:{checks:14,peak:8},iterative:{checks:25,peak:4}});
 assert.equal(budgetChoice('small',searchStats),'iterative');
 assert.equal(budgetChoice('large',searchStats),'breadth');
 assert.equal(budgetChoice('tight',searchStats),'neither');
 const s=createSearchBudget();s.answers={small:'iterative',large:'iterative',tight:'neither'};s.checked={small:true,large:true,tight:true};assert.equal(budgetComplete(s,searchStats),false);
 s.answers.large='breadth';assert.equal(budgetComplete(s,searchStats),true);
 const copy=restoreSearchBudget(s);copy.answers.small='breadth';assert.equal(s.answers.small,'iterative');
 assert.throws(()=>restoreSearchBudget({...s,answers:{...s.answers,tight:'unknown'}}));
});
test('old exploration drafts retain their progress and get a fresh budget exercise',()=>{
 const {budget,...old}=createIterative();old.positions.breadth=3;
 const r=restoreIterative(old);assert.equal(r.positions.breadth,3);assert.deepEqual(r.budget,createSearchBudget());
});
