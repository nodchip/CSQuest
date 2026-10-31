import test from 'node:test';
import assert from 'node:assert/strict';
import {varianceCases,varianceStats,varianceCorrect,createVariance,restoreVariance,varianceComplete} from '../src/variance.js';

test('all 2401 configurations agree with the independent second-moment identity',()=>{
  const solutions=Object.fromEntries(Object.keys(varianceCases).map(id=>[id,0]));
  for(let a=0;a<=6;a++)for(let b=0;b<=6;b++)for(let c=0;c<=6;c++)for(let d=0;d<=6;d++){
    const values=[a,b,c,d],sum=a+b+c+d,mean=sum/4,second=(a*a+b*b+c*c+d*d)/4,stats=varianceStats(values);
    assert.equal(stats.mean,mean);assert.equal(stats.variance,second-mean*mean);
    for(const [id,item] of Object.entries(varianceCases)){const expected=sum===12&&second-mean*mean===item.variance;assert.equal(varianceCorrect(id,{values}),expected);if(expected)solutions[id]++;}
  }
  for(const count of Object.values(solutions))assert.ok(count>0);
});
test('all targets require both checked and correct distributions',()=>{
  const state=createVariance();state.trials.steady={values:[3,3,3,3],slot:0,checked:true};state.trials.mixed={values:[0,2,4,6],slot:0,checked:true};state.trials.extreme={values:[0,0,6,6],slot:0,checked:true};assert.equal(varianceComplete(state),true);
  state.trials.mixed.checked=false;assert.equal(varianceComplete(state),false);
});
test('draft restoration copies valid values and rejects malformed cards',()=>{
  const saved=createVariance();saved.trials.steady.values=[3,3,3,3];const restored=restoreVariance(saved);saved.trials.steady.values[0]=0;assert.equal(restored.trials.steady.values[0],3);
  saved.trials.steady.values=[0,0,0,7];assert.throws(()=>restoreVariance(saved),RangeError);assert.throws(()=>varianceStats([1,2,3]),RangeError);
});
