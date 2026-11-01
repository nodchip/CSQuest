import test from 'node:test';
import assert from 'node:assert/strict';
import {irisPartition} from '../src/iris-learning.js';
import {irisLogisticFit,irisLogisticScore,irisLogisticEvaluate,irisLogisticBest,createIrisLogistic,irisLogisticComplete,restoreIrisLogistic} from '../src/iris-logistic.js';

test('all four trained models use training-only scale and match reference validation and test results',()=>{
 const p=irisPartition();assert.deepEqual([p.train.length,p.validation.length,p.test.length],[60,20,20]);const losses=[.28478884305809615,.17617477886621025,.397837702337431,.3941785853199792];
 for(let i=0;i<4;i++){const v=irisLogisticEvaluate(i,'validation'),t=irisLogisticEvaluate(i,'test');assert.deepEqual([v.tp,v.tn,v.fp,v.fn],[9,10,0,1]);assert.deepEqual([t.tp,t.tn,t.fp,t.fn],[10,9,1,0]);assert.ok(Math.abs(v.loss-losses[i])<1e-12);assert.ok(Math.abs(v.model.means[0]-48.93333333333333)<1e-12);assert.ok(Math.abs(v.model.means[1]-16.433333333333334)<1e-12);assert.equal(irisLogisticBest(i),i===1);}
 const model=irisLogisticFit(p.train,0,20),altered=p.validation.map(r=>[r[0]+1000,r[1],r[2]]);assert.notEqual(irisLogisticScore(model,altered).loss,irisLogisticScore(model,p.validation).loss);assert.deepEqual(irisLogisticFit(p.train,0,20),model);assert.throws(()=>irisLogisticFit([[1,1,0],[1,1,1]],0,20));
});
test('validation, best selection, locked test and reflection are required and restored',()=>{
 const s=createIrisLogistic();Object.assign(s,{selected:1,seen:15,locked:true,tested:true,answer:'limits',checked:true});assert.equal(irisLogisticComplete(restoreIrisLogistic(s)),true);assert.equal(irisLogisticComplete({...s,selected:0}),false);assert.equal(irisLogisticComplete({...s,tested:false}),false);assert.throws(()=>restoreIrisLogistic({...s,seen:7}));assert.throws(()=>restoreIrisLogistic({...s,selected:0}));assert.throws(()=>restoreIrisLogistic({...s,locked:false}));
});
