import test from 'node:test';
import assert from 'node:assert/strict';
import {enrollmentModels,enrollmentRequests,enrollmentStep,createEnrollment,restoreEnrollment,enrollmentComplete} from '../src/enrollment.js';

test('the three table constraints yield different accepted relations',()=>{
  const expected={person:[true,false,true,false,false],quest:[true,true,false,false,false],pair:[true,true,true,false,false]};
  for(const id of Object.keys(enrollmentModels)){let state=createEnrollment().states[id];for(let i=0;i<enrollmentRequests.length;i++)state=enrollmentStep(state);assert.deepEqual(state.results.map(row=>row.accepted),expected[id]);assert.equal(state.rows.length,expected[id].filter(Boolean).length);assert.throws(()=>enrollmentStep(state),RangeError);}
});
test('all three trials are required and partial steps restore safely',()=>{
  const state=createEnrollment();for(const id of Object.keys(enrollmentModels))for(let i=0;i<enrollmentRequests.length;i++)state.states[id]=enrollmentStep(state.states[id]);assert.equal(enrollmentComplete(state),false);state.concept={answers:{entities:'both',relation:'join',attribute:'participation',maximum:'manyMany',minimum:'allowed'},checked:true};assert.equal(enrollmentComplete(state),true);
  const saved={selected:'pair',steps:{person:5,quest:5,pair:3}},restored=restoreEnrollment(saved);assert.equal(restored.states.pair.rows.length,3);assert.equal(enrollmentComplete(restored),false);assert.throws(()=>restoreEnrollment({...saved,steps:{...saved.steps,pair:6}}),RangeError);const done=restoreEnrollment({...saved,steps:{person:5,quest:5,pair:5},concept:state.concept});assert.equal(enrollmentComplete(done),true);assert.equal(enrollmentComplete(restoreEnrollment({...saved,steps:{person:5,quest:5,pair:5}})),false);
});
