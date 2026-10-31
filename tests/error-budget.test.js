import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createBudget,stepBudget,budgetStats,budgetComplete,restoreBudget} from '../src/error-budget.js';
test('all 32 strategies count a fixed 100 requests and require both the target and a trial',()=>{
 let successes=0;for(let mask=0;mask<32;mask++){let s=createBudget();for(let i=0;i<5;i++)s=stepBudget(s,mask&(1<<i)?'trial':'normal');const stats=budgetStats(s);assert.equal(stats.processed,100);assert.equal(stats.successes+stats.failures,100);assert.equal(budgetComplete(s),stats.failures<=2&&mask!==0);if(budgetComplete(s))successes++;}assert.equal(successes,1);
});
test('a failed target, replayed progress and invalid actions are handled',()=>{
 let s=createBudget();s=stepBudget(s,'trial');s=stepBudget(s,'normal');const copy=restoreBudget({...s,history:[...s.history],message:'forged'});assert.equal(budgetStats(copy).failures,2);assert.notEqual(copy.message,'forged');assert.throws(()=>restoreBudget({history:['bad']}),RangeError);assert.throws(()=>restoreBudget({history:Array(6).fill('normal')}),RangeError);
});
