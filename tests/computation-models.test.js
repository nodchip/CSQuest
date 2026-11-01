import {test} from 'node:test';
import assert from 'node:assert/strict';
import {modelModes,modelRequired,modelTrace,createComputationModels,computationModelsComplete,restoreComputationModels} from '../src/computation-models.js';

test('２種類の機械が０〜４に１を足し、異なる手順を進める',()=>{
 for(let n=0;n<=4;n++)for(const mode of modelModes){
  const total=mode==='tape'?n+1:2*n+2;
  for(let step=0;step<=total;step++){const r=modelTrace(mode,n,step);assert.equal(r.halt,step===total);if(mode==='counter'&&!r.halt)assert.equal(r.a+r.b+(r.phase==='transfer'?1:0),n);}
  const r=modelTrace(mode,n,total);assert.equal(r.result,n+1);assert.equal(r.next,null);assert.throws(()=>modelTrace(mode,n,total+1),RangeError);
 }
 assert.equal(modelTrace('tape',2,2).next,'write');assert.equal(modelTrace('counter',2,1).next,'transfer');assert.equal(modelTrace('counter',0,1).next,'finish');
});
test('６回の比較とテーゼの２つの振り返りを検査して復元する',()=>{
 const s=createComputationModels();s.observed=[...modelRequired];s.thesis='effective';s.evidence='illustration';assert.equal(computationModelsComplete(s),false);s.checked=true;assert.equal(computationModelsComplete(s),true);
 const r=restoreComputationModels(s);r.observed.pop();assert.equal(s.observed.length,6);
 for(const p of [{mode:'bad'},{n:5},{steps:2},{observed:['bad']},{observed:['tape,0','tape,0']},{thesis:'bad'},{checked:1}])assert.throws(()=>restoreComputationModels({...s,...p}),RangeError);
});
