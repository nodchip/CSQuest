import {test} from 'node:test';
import assert from 'node:assert/strict';
import {correlationRow,correlationTotals,createCorrelation,correlationComplete,restoreCorrelation} from '../src/correlated-failure.js';
test('same marginal failures have different joint counts under independence and perfect correlation',()=>{
 const a=correlationTotals('independent'),b=correlationTotals('shared');assert.deepEqual(a,{neither:81,onlyA:9,onlyB:9,both:1});assert.deepEqual(b,{neither:90,onlyA:0,onlyB:0,both:10});for(const r of [a,b]){assert.equal(r.both+r.onlyA,10);assert.equal(r.both+r.onlyB,10);assert.equal(Object.values(r).reduce((x,y)=>x+y),100);}assert.throws(()=>correlationRow('bad',0),RangeError);
});
test('ten observed rows and the correct answer are needed for both cases; drafts are copied',()=>{
 const s=createCorrelation();s.trials.independent={rows:10,choice:1,checked:true};s.trials.shared={rows:10,choice:10,checked:true};const copy=restoreCorrelation(s);s.trials.shared.rows=9;assert.equal(correlationComplete(copy),true);assert.equal(correlationComplete(s),false);assert.throws(()=>restoreCorrelation({...copy,trials:{...copy.trials,shared:{rows:11,choice:10,checked:true}}}),RangeError);
});
