import test from 'node:test';
import assert from 'node:assert/strict';
import {twoStageCreate,twoStageTranslate,twoStageStep,twoStageRestore,twoStageComplete} from '../src/two-stage-memory.js';

test('both translation stages and write permissions agree for all configurations',()=>{
 for(const map of [1,3])for(const guest of ['a','b'])for(const page of [0,1])for(const action of ['read','write']){
  const r=twoStageTranslate(guest,page,map,action),gp=1-page;
  assert.equal(r.gp,gp);assert.equal(r.frame,guest==='a'?gp:gp===0?2:map);
  assert.equal(r.blocked,action==='read'?null:guest==='a'&&page===1?'guest':guest==='b'&&page===1?'host':null);
 }
});
test('separate mappings, both protection checks, deliberate sharing and restoration',()=>{
 const s=twoStageCreate(),t=s.trial,op=(action,guest,page)=>twoStageStep(t,{action,guest,page}),map=frame=>twoStageStep(t,{action:'map',frame});
 op('write','a',0);op('read','b',0);const before=[...t.frames];op('write','a',1);op('write','b',1);assert.deepEqual(t.frames,before);map(1);op('read','b',0);op('write','b',0);op('read','a',0);assert.equal(t.frames[1],9);map(3);op('read','b',0);assert.ok(twoStageComplete(s));assert.deepEqual(twoStageRestore(s).trial.flags,t.flags);
 assert.throws(()=>twoStageRestore({...s,trial:{history:[{action:'map',frame:2}]}}));assert.throws(()=>twoStageTranslate('a',2,3,'read'));
});
