import test from 'node:test';
import assert from 'node:assert/strict';
import {logFields,logEvents,logPolicyCreate,inspectLogPolicy,logPolicyComplete,logPolicyRestore} from '../src/log-policy.js';

test('all field and retention combinations respect the fixed task and data limits',()=>{
 const fields=Object.keys(logFields);
 for(let mask=0;mask<16;mask++)for(const days of [1,7,30]){
  const state={fields:fields.filter((_,i)=>mask&(1<<i)),days,checked:true,reflection:'limits'};
  const result=inspectLogPolicy(state);
  assert.equal(result.visible.length,days===1?0:logEvents.length);
  assert.equal(result.detected,(mask&7)!==7?null:days!==1);
  assert.equal(result.excess,!!(mask&8)||days===30);
  assert.equal(logPolicyComplete(state),mask===7&&days===7);
 }
});
test('saved configurations restore independently and reject malformed records',()=>{
 const s=logPolicyCreate();s.fields=['time'];s.days=7;const restored=logPolicyRestore(s);restored.fields.push('account');assert.deepEqual(s.fields,['time']);
 for(const bad of [{...s,fields:['time','time']},{...s,fields:['unknown']},{...s,days:3},{...s,checked:1}])assert.throws(()=>logPolicyRestore(bad));
});
