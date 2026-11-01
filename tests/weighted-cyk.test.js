import test from 'node:test';
import assert from 'node:assert/strict';
import {weightedCyk,createWeightedCyk,weightedCykSplitPass,weightedCykComplete,restoreWeightedCyk} from '../src/weighted-cyk.js';

test('inside sums and maximum parse weights match independently enumerated trees',()=>{
 const rules={S:[['N','X',0.5],['X','N',0.25],['N','N',0.25]],X:[['N','N',1]],N:[]};
 function enumerate(symbol,n){if(n===1)return symbol==='N'?[1]:[];const values=[];for(const [left,right,p] of rules[symbol])for(let cut=1;cut<n;cut++)for(const a of enumerate(left,cut))for(const b of enumerate(right,n-cut))values.push(p*a*b);return values;}
 for(let n=1;n<=6;n++){const chart=weightedCyk(n);for(const symbol of ['S','X','N']){const trees=enumerate(symbol,n),cell=chart.chart[0][n][symbol];assert.equal(cell.sum,trees.reduce((a,b)=>a+b,0));assert.equal(cell.best,Math.max(0,...trees));}}
 assert.deepEqual(weightedCyk(3).splits,[{mid:1,sum:0.5,best:0.5},{mid:2,sum:0.25,best:0.25}]);assert.deepEqual(weightedCyk(3).root,{sum:0.75,best:0.5});assert.deepEqual(weightedCyk(2).root,{sum:0.25,best:0.25});
});
test('each checked split, total, best structure and reflection are required',()=>{
 const s=createWeightedCyk();s.guesses=[2,1];s.tested=[true,true];s.total=3;s.best=1;s.answer='sum';s.checked=true;assert.ok(weightedCykSplitPass(s,1));assert.ok(weightedCykSplitPass(s,2));assert.ok(weightedCykComplete(s));const r=restoreWeightedCyk(s);r.guesses[0]=1;assert.equal(s.guesses[0],2);assert.equal(weightedCykComplete(r),false);assert.throws(()=>restoreWeightedCyk({...s,guesses:[null,1]}));assert.throws(()=>weightedCyk(0));
});
