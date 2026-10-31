import test from 'node:test';
import assert from 'node:assert/strict';
import {regressionCases,regressionSlopes,regressionIntercepts,regressionResult,regressionMinimum,createRegression,restoreRegression,regressionComplete} from '../src/regression.js';

test('every candidate score agrees with independent sums and analytic least-squares solutions',()=>{
 for(const id of Object.keys(regressionCases)){
  const points=regressionCases[id].points,n=points.length,xmean=points.reduce((s,p)=>s+p.x,0)/n,ymean=points.reduce((s,p)=>s+p.y,0)/n;
  const slope=points.reduce((s,p)=>s+(p.x-xmean)*(p.y-ymean),0)/points.reduce((s,p)=>s+(p.x-xmean)**2,0),intercept=ymean-slope*xmean;
  for(const m of regressionSlopes)for(const b of regressionIntercepts){const expected=points.reduce((s,p)=>s+(p.y-m*p.x-b)**2,0);assert.equal(regressionResult(id,m,b).total,expected);assert.ok(expected>=regressionResult(id,slope,intercept).total);}
  assert.deepEqual([slope,intercept,regressionMinimum(id)],id==='regular'?[1,1,0]:[2.5,0,7.5]);
 }
});
test('both checked best lines are required and saved settings are copied and validated',()=>{
 const set=createRegression();set.trials.regular={slope:1,intercept:1,checked:true};set.trials.large={slope:2.5,intercept:0,checked:false};assert.equal(regressionComplete(set),false);set.trials.large.checked=true;assert.equal(regressionComplete(set),true);const saved=restoreRegression(set);set.trials.large.slope=2;assert.equal(saved.trials.large.slope,2.5);assert.throws(()=>restoreRegression({...saved,selected:'unknown'}),RangeError);
});
