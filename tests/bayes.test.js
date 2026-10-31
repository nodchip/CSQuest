import test from 'node:test';
import assert from 'node:assert/strict';
import {records,bayesCases,bayesExpected,bayesCounts,bayesCorrect,createBayes,restoreBayes,bayesComplete} from '../src/bayes.js';
const sum=predicate=>records.filter(predicate).reduce((n,r)=>n+r.count,0);

test('joint distribution has 100 cases and both conditional independence identities',()=>{
  assert.equal(sum(()=>true),100);
  for(const rain of [true,false]){
    const total=sum(r=>r.rain===rain),wet=sum(r=>r.rain===rain&&r.wet),bell=sum(r=>r.rain===rain&&r.bell),both=sum(r=>r.rain===rain&&r.wet&&r.bell);
    assert.equal(both*total,wet*bell);
  }
  assert.notEqual(sum(r=>r.wet&&r.bell)*100,sum(r=>r.wet)*sum(r=>r.bell));
});
test('each question selects the correct exact rows and counts',()=>{
  for(const [id,n,d] of [['wet',16,24],['both',12,14],['rainWet',12,16]]){
    const expected=bayesExpected(id);assert.deepEqual(bayesCounts(expected),{numerator:n,denominator:d});assert.equal(bayesCorrect(id,expected),true);
    for(const key of ['numerator','denominator'])for(let i=0;i<records.length;i++){
      const altered={numerator:expected.numerator.slice(),denominator:expected.denominator.slice()};altered[key]=altered[key].includes(i)?altered[key].filter(x=>x!==i):[...altered[key],i];assert.equal(bayesCorrect(id,altered),false);
    }
  }
});
test('saved selections are copied and malformed selections rejected',()=>{
  const state=createBayes();for(const id of Object.keys(bayesCases))state.choices[id]={...bayesExpected(id),checked:true};assert.equal(bayesComplete(state),true);
  const restored=restoreBayes(state);state.choices.wet.numerator.push(7);assert.equal(bayesComplete(restored),true);assert.throws(()=>restoreBayes({...state,selected:'unknown'}),RangeError);
  state.choices.wet.numerator=[0,0];assert.throws(()=>restoreBayes(state),RangeError);
});
