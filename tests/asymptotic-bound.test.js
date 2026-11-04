import test from 'node:test';
import assert from 'node:assert/strict';
import {boundCounts,boundWinner,boundProof,boundLowerCounterexample,boundProofOptions,createBound,boundComplete,restoreBound} from '../src/asymptotic-bound.js';
test('constant factor reverses the comparison across the threshold',()=>{assert.deepEqual([4,8,16].map(boundCounts),[{linear:32,pairs:16},{linear:64,pairs:64},{linear:128,pairs:256}]);assert.deepEqual([4,8,16].map(boundWinner),['pairs','same','linear']);assert.throws(()=>boundCounts(0));});
test('all comparisons and upper-bound interpretation are required',()=>{const s=createBound();for(const n of [4,8,16])s.trials[n]={guess:boundWinner(n),checked:true};s.answer='upper';s.checked=true;assert.equal(boundComplete(s),true);const copy=restoreBound(s);copy.trials[8].guess='linear';assert.equal(boundComplete(copy),false);assert.equal(boundComplete(s),true);assert.throws(()=>restoreBound({...s,size:12}));});
test('a chosen factor and threshold yield a proof or a counterexample at the threshold',()=>{
 for(const c of boundProofOptions)for(const start of boundProofOptions){
  const proof=boundProof(c,start);assert.equal(proof.valid,proof.left<=proof.right);
  if(proof.valid)for(let n=start;n<=100;n++)assert.ok(8*n<=c*n*n);
  else assert.ok(8*start>c*start*start);
 }
 assert.throws(()=>boundProof(0,1));
 const old=createBound();delete old.proofC;delete old.proofStart;
 assert.equal(restoreBound(old).proofC,1);assert.equal(restoreBound({...old,proofC:2,proofStart:4}).proofStart,4);
 assert.throws(()=>restoreBound({...old,proofStart:0}));
});
test('every chosen positive factor and threshold has a lower-bound counterexample',()=>{
 for(const c of boundProofOptions)for(const start of boundProofOptions){
  const result=boundLowerCounterexample(c,start);
  assert.ok(result.n>=start);assert.equal(result.left,8*result.n);assert.equal(result.right,c*result.n**2);assert.ok(result.left<result.right);
  for(let n=start;n<result.n;n++)assert.ok(8*n>=c*n*n);
 }
 assert.deepEqual(boundLowerCounterexample(1,1),{n:9,left:72,right:81});
 assert.throws(()=>boundLowerCounterexample(0,1));
});
