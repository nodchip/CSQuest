import test from 'node:test';
import assert from 'node:assert/strict';
import {createWebRequest,webRequestStep,restoreWebRequest,webRequestComplete} from '../src/web-request.js';
test('a lost response after a successful POST is not evidence that the operation failed',()=>{
  let s=createWebRequest('plain');s=webRequestStep(s,'send');assert.equal(s.count,1);assert.equal(s.phase,'lost');assert.equal(webRequestStep(s,'one').phase,'lost');s=webRequestStep(s,'two');s=webRequestStep(s,'retry');assert.equal(s.count,2);
});
test('the modeled server reuses a result for the same key',()=>{
  let s=createWebRequest('keyed');s=webRequestStep(s,'send');assert.equal(webRequestStep(s,'two').phase,'lost');s=webRequestStep(s,'one');s=webRequestStep(s,'retry');assert.equal(s.count,1);
});
test('restore replays valid steps and requires both completed trials',()=>{
  const saved={selected:'keyed',history:{plain:['send','two','retry'],keyed:['send','one']}};const s=restoreWebRequest(saved);assert.equal(webRequestComplete(s),false);s.states.keyed=webRequestStep(s.states.keyed,'retry');assert.equal(webRequestComplete(s),true);
  assert.throws(()=>restoreWebRequest({...saved,history:{...saved.history,keyed:['send','two']}}),RangeError);assert.throws(()=>restoreWebRequest({...saved,history:{...saved.history,plain:['retry']}}),RangeError);
});
