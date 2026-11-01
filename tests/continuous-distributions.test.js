import {test} from 'node:test';
import assert from 'node:assert/strict';
import {continuousModels,continuousRanges,continuousRequired,continuousDensity,continuousCdf,continuousProbability,continuousSurvivalComparison,createContinuousDistributions,continuousDistributionsComplete,restoreContinuousDistributions} from '../src/continuous-distributions.js';

test('各密度の区間確率と数値積分を比較する',()=>{
 const expected={uniform:{left:0.25,right:0.5},normal:{left:0.135905121983278,right:0.477249868051821},exponential:{left:1-Math.exp(-1),right:Math.exp(-2)-Math.exp(-4)}};
 for(const model of Object.keys(continuousModels))for(const range of Object.keys(continuousRanges)){
  const p=continuousProbability(model,range);assert.ok(Math.abs(p-(range==='point'?0:expected[model][range]))<1e-9);
  if(range!=='point'){const {a,b}=continuousRanges[range],n=10000,h=(b-a)/n;let area=0;for(let i=0;i<n;i++)area+=continuousDensity(model,a+(i+0.5)*h)*h;assert.ok(Math.abs(area-p)<1e-6);}
 }
 assert.equal(continuousDensity('uniform',-1),0);assert.equal(continuousDensity('exponential',-1),0);assert.ok(continuousDensity('normal',-1)>0);assert.equal(continuousCdf('normal',100),1);assert.equal(continuousCdf('normal',-100),0);
});
test('指数分布の無記憶性と他の２例を区別する',()=>{
 const e=continuousSurvivalComparison('exponential'),u=continuousSurvivalComparison('uniform'),n=continuousSurvivalComparison('normal');assert.ok(Math.abs(e.unconditional-Math.exp(-1))<1e-12);assert.ok(Math.abs(e.conditional-e.unconditional)<1e-12);assert.ok(Math.abs(u.conditional-2/3)<1e-12);assert.ok(Math.abs(n.conditional-0.59428670867253)<1e-9);assert.notEqual(u.conditional,u.unconditional);
});
test('９観察と３つの振り返りを検証し復元する',()=>{
 const s=createContinuousDistributions();s.observed=[...continuousRequired];s.negative='normal';s.point='zero';s.memory='exponential';assert.equal(continuousDistributionsComplete(s),false);s.checked=true;assert.equal(continuousDistributionsComplete(s),true);const r=restoreContinuousDistributions(s);r.observed.pop();assert.equal(s.observed.length,9);
 for(const p of [{model:'bad'},{range:'bad'},{observed:['bad']},{observed:['normal,left','normal,left']},{point:'bad'},{checked:1}])assert.throws(()=>restoreContinuousDistributions({...s,...p}),RangeError);
});
