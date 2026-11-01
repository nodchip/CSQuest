import test from 'node:test';
import assert from 'node:assert/strict';
import {learningAssumptionsResult,createLearningAssumptions,learningAssumptionsComplete,restoreLearningAssumptions} from '../src/learning-assumptions.js';

test('all observed labels, assumptions and rules produce the correct possible worlds',()=>{
 for(const first of [0,1])for(const second of [0,1])for(const assumption of ['any','same','opposite'])for(const rule of ['same','opposite']){
  const r=learningAssumptionsResult(first,second,assumption,rule),prediction=rule==='same'?first:1-first;assert.equal(r.prediction,prediction);assert.deepEqual(r.worlds.map(w=>w.hidden),assumption==='any'?[0,1]:[assumption==='same'?first:1-first]);assert.equal(r.correct,r.worlds.filter(w=>w.hidden===prediction).length);assert.equal(r.correct,assumption==='any'?1:assumption===rule?1:0);
 }
});
test('under a uniform choice of all eight functions, every deterministic rule on the two observed labels has half correct',()=>{
 for(let policy=0;policy<16;policy++){let successes=0;for(let labels=0;labels<8;labels++){const first=labels&1,second=(labels>>1)&1,hidden=(labels>>2)&1,index=first+2*second,prediction=(policy>>index)&1;if(prediction===hidden)successes++;}assert.equal(successes,4);}
});
test('all six comparisons and the limited conclusion are required',()=>{
 const s=createLearningAssumptions();s.observed=['any,same','any,opposite','same,same','same,opposite','opposite,same','opposite,opposite'];s.answer='assumptions';s.checked=true;const copy=restoreLearningAssumptions(s);assert.equal(learningAssumptionsComplete(copy),true);copy.observed.pop();assert.equal(s.observed.length,6);assert.equal(learningAssumptionsComplete(copy),false);assert.throws(()=>restoreLearningAssumptions({...s,observed:['any,same','any,same']}));
});
