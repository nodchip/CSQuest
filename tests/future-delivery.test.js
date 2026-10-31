import test from 'node:test';
import assert from 'node:assert/strict';
import {createFutureTrial,stepFuture,createFutures,futureTrialCorrect,futuresComplete,restoreFutures} from '../src/future-delivery.js';

test('pending work cannot be used, and successful and failed results resume differently',()=>{
  const all=createFutures();for(const [id,last] of [['success','use'],['failure','recover']]){let s=createFutureTrial(id);for(const a of ['start','early','await','other','complete',last])s=stepFuture(s,a);assert.equal(s.result,id==='success'?'fulfilled':'rejected');assert.ok(futureTrialCorrect(s));all.trials[id]=s;}assert.ok(futuresComplete(all));
  let failure=createFutureTrial('failure');for(const a of ['start','await','complete'])failure=stepFuture(failure,a);assert.equal(stepFuture(failure,'use').history.length,failure.history.length);assert.equal(failure.resumed,true);
});
test('saved actions restore waiting and reject impossible histories',()=>{
  const histories={success:['start','early','await','other'],failure:[]};const s=restoreFutures({selected:'success',histories}).trials.success;assert.equal(s.result,'pending');assert.equal(s.waiting,true);assert.equal(s.other,true);
  assert.throws(()=>restoreFutures({selected:'success',histories:{...histories,success:['start','use']}}));
});
