import test from 'node:test';
import assert from 'node:assert/strict';
import {createWritePolicy,createWritePolicyTrial,writePolicyStep,writePolicyComplete,restoreWritePolicy} from '../src/write-policy.js';

test('write policies update backing memory at different times and write back a dirty eviction',()=>{
 for(const [mode,before,count] of [['through',2,2],['back',0,1]]){
  let t=createWritePolicyTrial(mode);
  for(const action of ['readA','write1','write2'])t=writePolicyStep(t,action);
  assert.equal(t.cache.value,2);assert.equal(t.memory.A,before);assert.equal(t.cache.dirty,mode==='back');
  const wrong=writePolicyStep(t,`before:${before===0?2:0}`);assert.equal(wrong.history.length,3);assert.equal(wrong.memory.A,before);
  t=writePolicyStep(t,`before:${before}`);t=writePolicyStep(t,'readB');assert.deepEqual(t.cache,{tag:'B',value:0,dirty:false});assert.equal(t.memory.A,2);assert.equal(t.writes,count);
  t=writePolicyStep(t,'after:2');t=writePolicyStep(t,`count:${count}`);assert.equal(t.history.length,7);assert.throws(()=>writePolicyStep(t,'readA'));
 }
});
test('replay restores partial and completed histories and rejects incorrect records',()=>{
 const s=createWritePolicy();const histories={through:['readA','write1','write2','before:2','readB','after:2','count:2'],back:['readA','write1','write2','before:0','readB','after:2','count:1']};
 const restored=restoreWritePolicy({selected:'back',histories,answer:'coalesce',checked:true});assert.ok(writePolicyComplete(restored));assert.equal(restored.trials.back.writes,1);
 assert.throws(()=>restoreWritePolicy({selected:'back',histories:{...histories,back:['readA','write1','write2','before:2']},answer:null,checked:false}));
 assert.equal(writePolicyComplete(s),false);
});
