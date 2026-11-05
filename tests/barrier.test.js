import test from 'node:test';
import assert from 'node:assert/strict';
import {createBarrier,barrierStep,barrierCaseCorrect,createBarrierSet,restoreBarrier,barrierComplete,handoffReplay} from '../src/barrier.js';

function outcomes(mode){const result=[];function visit(s){if(Object.values(s.workers).every(w=>w.phase==='done')){result.push(s);return;}for(const id of ['A','B'])if(!['done','wait'].includes(s.workers[id].phase))visit(barrierStep(s,id));}visit(createBarrier(mode));return result;}
test('enumerated schedules show stale reads without a barrier and consistent reads with one',()=>{
  const free=outcomes('free'),barrier=outcomes('barrier');assert.ok(free.some(s=>barrierCaseCorrect('free',s)));assert.ok(free.some(s=>!barrierCaseCorrect('free',s)));
  assert.ok(barrier.length>0);for(const state of barrier){assert.equal(barrierCaseCorrect('barrier',state),true);assert.equal(state.workers.A.result,5);assert.equal(state.workers.B.result,5);assert.deepEqual(restoreBarrier({selected:'barrier',history:{free:[],barrier:state.history}}).states.barrier,state);}
});
test('arrived worker cannot read before the other arrives',()=>{
  let s=createBarrier('barrier');s=barrierStep(s,'A');s=barrierStep(s,'A');assert.equal(s.workers.A.phase,'wait');const waiting=barrierStep(s,'A');assert.deepEqual(waiting.history,s.history);assert.equal(waiting.workers.A.result,null);
  s=barrierStep(s,'B');assert.equal(s.workers.A.phase,'wait');s=barrierStep(s,'B');assert.equal(s.workers.A.phase,'read');assert.equal(s.workers.B.phase,'read');
});
test('history restoration rejects blocked advances and both cases are required',()=>{
  const free=outcomes('free').find(s=>barrierCaseCorrect('free',s)),barrier=outcomes('barrier')[0],saved={selected:'free',history:{free:free.history,barrier:barrier.history}};
  assert.equal(barrierComplete(restoreBarrier(saved)),true);assert.equal(barrierComplete(createBarrierSet()),false);
  assert.throws(()=>restoreBarrier({...saved,history:{free:[],barrier:['A','A','A']}}),RangeError);
});

test('point to point handoff distinguishes a stale relaxed observation from release acquire',()=>{
 const h=['write','signal','poll','read'];assert.equal(handoffReplay('relaxed',h).result,0);assert.equal(handoffReplay('ordered',h).result,1);assert.equal(handoffReplay('relaxed',['write','flush','signal','poll','read']).result,1);
 assert.throws(()=>handoffReplay('ordered',['poll','read']));assert.equal(handoffReplay('ordered',['poll','write','signal','poll','read']).result,1);assert.throws(()=>handoffReplay('ordered',['write','signal','flush']));
 const old={selected:'free',history:{free:[],barrier:[]}};assert.deepEqual(restoreBarrier(old).handoffHistory,{relaxed:[],ordered:[]});const q={...old,handoffSelected:'relaxed',handoffHistory:{relaxed:h,ordered:[]}},copy=restoreBarrier(q);copy.handoffHistory.relaxed.pop();assert.equal(q.handoffHistory.relaxed.length,4);assert.throws(()=>restoreBarrier({...old,handoffHistory:{relaxed:['read']}}));
});
