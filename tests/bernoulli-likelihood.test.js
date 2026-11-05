import test from 'node:test';
import assert from 'node:assert/strict';
import {likelihoodCases,likelihoodChoices,likelihoodNumerator,createLikelihood,likelihoodTrialValid,likelihoodComplete,restoreLikelihood} from '../src/bernoulli-likelihood.js';
test('likelihoods represent the specific ordered observations under independent Bernoulli trials',()=>{assert.deepEqual(likelihoodChoices.map(k=>likelihoodNumerator('three',k)),[0,3,16,27,0]);assert.deepEqual(likelihoodChoices.map(k=>likelihoodNumerator('two',k)),[0,9,16,9,0]);for(const [id,c] of Object.entries(likelihoodCases))for(const k of likelihoodChoices)assert.equal(likelihoodNumerator(id,k)/256,(k/4)**c.success*(1-k/4)**(4-c.success));});
test('all candidates and both observation sets must be checked',()=>{const s=createLikelihood();for(const [id,k] of [['three',3],['two',2]]){s.trials[id]={candidate:k,tested:[0,1,2,3,4],done:true};assert.ok(likelihoodTrialValid(id,s.trials[id]));}s.answer='likelihood';s.checked=true;assert.ok(likelihoodComplete(s));assert.deepEqual(restoreLikelihood(s),s);s.trials.three.candidate=2;assert.throws(()=>restoreLikelihood(s));});

test('all success counts include endpoint maxima and old saved drafts restore',()=>{
 const counts={zero:0,one:1,two:2,three:3,four:4};
 for(const [id,success] of Object.entries(counts)){const values=likelihoodChoices.map(k=>likelihoodNumerator(id,k));assert.equal(values.indexOf(Math.max(...values)),success);for(const k of likelihoodChoices)assert.equal(values[k],k**success*(4-k)**(4-success));}
 const q=createLikelihood();for(const id of ['zero','one','four'])delete q.trials[id];const restored=restoreLikelihood(q);assert.deepEqual(restored.trials.zero,{candidate:0,tested:[],done:false});
 restored.trials.zero={candidate:0,tested:[0,1,2,3,4],done:true};restored.trials.three={candidate:3,tested:[0,1,2,3,4],done:true};restored.trials.two={candidate:2,tested:[0,1,2,3,4],done:true};restored.answer='likelihood';restored.checked=true;assert.equal(likelihoodComplete(restoreLikelihood(restored)),true);
});
