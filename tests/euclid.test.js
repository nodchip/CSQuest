import test from 'node:test';
import assert from 'node:assert/strict';
import {euclidCases,euclidOptions,createEuclid,euclidStep,restoreEuclid} from '../src/euclid.js';

test('both displayed examples agree with independently enumerated common divisors',()=>{
  let state=createEuclid();
  for(const [a,b] of euclidCases){
    const gcd=Array.from({length:Math.min(a,b)},(_,i)=>i+1).filter(n=>a%n===0&&b%n===0).at(-1);
    while(state.b){const remainder=state.a%state.b;assert.ok(euclidOptions.includes(remainder));state=euclidStep(state,remainder);}
    assert.equal(state.a,gcd);state=euclidStep(state,gcd);
  }
  assert.equal(state.trial,euclidCases.length);
});
test('incorrect selections preserve progress and validated history resumes',()=>{
  let state=createEuclid();for(const answer of [12,6,0,6,11,1,0,1]){const expected=state.b?state.a%state.b:state.a;const wrong=euclidOptions.find(n=>n!==expected);assert.deepEqual(euclidStep(state,wrong).history,state.history);state=euclidStep(state,answer);assert.deepEqual(restoreEuclid(state.history),state);}
  assert.throws(()=>euclidStep(state,0),RangeError);assert.throws(()=>restoreEuclid([1]),RangeError);assert.throws(()=>restoreEuclid([...state.history,0]),RangeError);
});
