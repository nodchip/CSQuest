import test from 'node:test';
import assert from 'node:assert/strict';
import {reductionBoxes,reductionCases,newReductionTrial,createReduction,reductionTotals,reductionReady,reductionResult,reductionCorrect,reductionComplete,restoreReduction} from '../src/reduction.js';
test('all assignments preserve totals; allocation requirement and sum are independently enforced',()=>{
 for(const id of Object.keys(reductionCases)){let accepted=0;for(let mask=0;mask<16;mask++){const t=newReductionTrial();t.assigned=reductionBoxes.map((_,i)=>mask&(1<<i)?'a':'b');if(!reductionReady(t))continue;t.processed={a:true,b:true};t.operation='sum';t.checked=true;const totals=reductionTotals(t);assert.equal(totals.a+totals.b,8);if(reductionCorrect(id,t))accepted++;t.operation='max';assert.equal(reductionCorrect(id,t),false);}assert.equal(accepted,id==='even'?6:8);}
});
test('both allocation trials must be completed and draft rejects inconsistent states',()=>{
 const s=createReduction();Object.assign(s.trials.even,{assigned:['a','a','b','b'],processed:{a:true,b:true},operation:'sum',checked:true});Object.assign(s.trials.uneven,{assigned:['a','a','a','b'],processed:{a:true,b:true},operation:'sum',checked:true});assert.equal(reductionResult(s.trials.even),8);assert.equal(reductionComplete(s),true);const copy=restoreReduction(s);s.trials.even.assigned[0]='b';assert.equal(copy.trials.even.assigned[0],'a');copy.trials.even.processed.a=false;assert.throws(()=>restoreReduction(copy),RangeError);
});
