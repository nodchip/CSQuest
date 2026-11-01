import test from 'node:test';
import assert from 'node:assert/strict';
import {explainIris,explanationInputs,explanationMethods,createIrisExplanation,irisExplanationComplete,restoreIrisExplanation} from '../src/iris-explanation.js';
test('single-feature changes produce the expected model outputs and evidence',()=>{
 const expected={threshold:[0,1,0],nearest:[0,0,1]};
 for(const method of Object.keys(expected)) Object.keys(explanationInputs).forEach((input,i)=>{const r=explainIris(method,input);assert.equal(r.prediction,expected[method][i]);if(method==='threshold')assert.equal(r.threshold,47.5);else {assert.equal(r.neighbor[2],r.prediction);const p=explanationInputs[input].values;assert.equal(r.squaredDistance,(p[0]-r.neighbor[0])**2+(p[1]-r.neighbor[1])**2);}});
 assert.throws(()=>explainIris('x','base'));
});
test('all six observations and a qualified conclusion are required',()=>{
 const s=createIrisExplanation();s.observed=Object.keys(explanationMethods).flatMap(m=>Object.keys(explanationInputs).map(i=>`${m}:${i}`));s.answer='limited';s.checked=true;assert.ok(irisExplanationComplete(s));assert.deepEqual(restoreIrisExplanation(s),s);s.observed.pop();assert.equal(irisExplanationComplete(s),false);assert.throws(()=>restoreIrisExplanation({...s,observed:['nearest:bogus']}));
});
