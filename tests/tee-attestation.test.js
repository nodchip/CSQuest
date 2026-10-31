import {test} from 'node:test';
import assert from 'node:assert/strict';
import {teeEvaluate,teeReports,createTee,teeComplete,restoreTee} from '../src/tee-attestation.js';
test('all eight verification policies admit precisely the reports allowed by their selected checks',()=>{
 for(let mask=0;mask<8;mask++){const checks={signature:!!(mask&1),measurement:!!(mask&2),fresh:!!(mask&4)},results=teeEvaluate(checks);assert.deepEqual(results.map(r=>r.release),teeReports.map(r=>(!checks.signature||r.signature)&&(!checks.measurement||r.measurement)&&(!checks.fresh||r.fresh)));}
});
test('both a faulty policy and a policy that accepts only the valid report must be tried and restored independently',()=>{
 const s=createTee();s.history.push({...s.checks});assert.equal(teeComplete(s),false);s.history.push({signature:true,measurement:true,fresh:true});const copy=restoreTee(s);assert.equal(teeComplete(copy),true);s.history.pop();assert.equal(teeComplete(s),false);assert.throws(()=>restoreTee({...s,history:[{signature:true}]}),RangeError);
});
