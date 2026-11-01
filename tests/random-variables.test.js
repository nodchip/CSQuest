import {test} from 'node:test';
import assert from 'node:assert/strict';
import {variableCases,variableStats,variableTrialCorrect,createRandomVariables,randomVariablesComplete,restoreRandomVariables} from '../src/random-variables.js';

test('３例の同時分布・独立性・共分散を確認する',()=>{
 const i=variableCases.independent,d=variableCases.dependent,c=variableCases.covariance;
 assert.equal(variableStats(i.x,i.y).independent,true);assert.equal(variableStats(i.x,i.y).cov16,0);
 assert.equal(variableStats(d.x,d.y).independent,false);assert.equal(variableStats(d.x,d.y).cov16,2);
 const r=variableStats(c.x,c.y);assert.equal(r.independent,false);assert.equal(r.cov16,0);assert.deepEqual(r.rows.find(row=>row.value===0),{value:0,counts:[2,0],total:2});assert.deepEqual(r.yCounts,[2,2]);
});
test('すべての値割当てで独立性を条件付き頻度と照合する',()=>{
 for(let a=0;a<81;a++)for(let b=0;b<16;b++){
  let code=a;const x=Array.from({length:4},()=>{const n=code%3-1;code=Math.floor(code/3);return n;}),y=Array.from({length:4},(_,i)=>(b>>i)&1),r=variableStats(x,y);
  const independent=[...new Set(x)].every(v=>{const indices=x.map((n,i)=>n===v?i:-1).filter(i=>i>=0);return [0,1].every(z=>indices.filter(i=>y[i]===z).length*4===indices.length*y.filter(n=>n===z).length);});assert.equal(r.independent,independent);
 }
 assert.throws(()=>variableStats([0,1],[0,1]),RangeError);
});
test('各例の値と独立性の選択が必要で途中記録を複製する',()=>{
 const s=createRandomVariables();for(const [id,c] of Object.entries(variableCases))s.trials[id]={x:[...c.x],y:[...c.y],independent:c.independent,checked:true};assert.equal(randomVariablesComplete(s),true);s.trials.covariance.independent='yes';assert.equal(randomVariablesComplete(s),false);assert.equal(variableTrialCorrect('covariance',s.trials.covariance),false);
 const r=restoreRandomVariables(s);r.trials.independent.x[0]=0;assert.equal(s.trials.independent.x[0],1);
 for(const p of [{selected:'bad'},{trials:{...s.trials,independent:{x:[0],y:[0,0,0,0],independent:null,checked:false}}},{trials:{...s.trials,independent:{x:[0,0,0,0],y:[0,0,0,2],independent:null,checked:false}}}])assert.throws(()=>restoreRandomVariables({...s,...p}),RangeError);
});
