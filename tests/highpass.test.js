import test from 'node:test';
import assert from 'node:assert/strict';
import {highpassCases,highpassWeights,highpassPredictions,highpassValue,highpassCorrect,createHighpass,restoreHighpass,highpassComplete} from '../src/highpass.js';
test('the signed second difference is zero for flat, positive for a peak, negative for a dip',()=>{
 assert.deepEqual(Object.keys(highpassCases).map(id=>highpassValue(id,[-1,2,-1])),[0,8,-8]);assert.equal(highpassValue('flat',[null,2,-1]),null);for(const id of Object.keys(highpassCases)){let accepted=0;for(const a of highpassWeights)for(const b of highpassWeights)for(const c of highpassWeights)for(const prediction of highpassPredictions)if(highpassCorrect(id,{weights:[a,b,c],prediction,checked:true}))accepted++;assert.equal(accepted,1);}
});
test('all correct checked trials are required, and saved weights validate and copy',()=>{
 const s=createHighpass();for(const id of Object.keys(highpassCases))s.choices[id]={weights:[-1,2,-1],prediction:highpassValue(id,[-1,2,-1]),checked:true};assert.equal(highpassComplete(s),true);const r=restoreHighpass(s);s.choices.flat.weights[0]=0;assert.equal(highpassComplete(s),false);assert.equal(r.choices.flat.weights[0],-1);r.choices.flat.weights[0]=99;assert.throws(()=>restoreHighpass(r),RangeError);
});
