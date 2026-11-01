import test from 'node:test';
import assert from 'node:assert/strict';
import {granularityModes,granularityCases,granularityActions,createGranularityTrial,granularityStep,replayGranularity,granularityTrialComplete,createLockGranularity,lockGranularityComplete,restoreLockGranularity} from '../src/lock-granularity.js';
test('all reachable states preserve exclusion and yield the expected minimum time',()=>{
 for(const mode of Object.keys(granularityModes))for(const id of Object.keys(granularityCases)){
  const start=createGranularityTrial(mode,id),queue=[start],seen=new Set(),times=[];
  while(queue.length){const s=queue.shift(),key=JSON.stringify({time:s.time,workers:s.workers,owners:s.owners});if(seen.has(key))continue;seen.add(key);
   for(const w of ['A','B'])if(s.workers[w].status==='working'){const lock=mode==='coarse'?'all':granularityCases[id].targets[w];assert.equal(s.owners[lock],w);}
   if(s.workers.A.status==='working'&&s.workers.B.status==='working')assert.ok(mode==='fine'&&id==='different');
   if(s.workers.A.status==='done'&&s.workers.B.status==='done')times.push(s.time);
   for(const action of Object.keys(granularityActions)){const n=granularityStep(s,action);if(n)queue.push(n);}
  }
  assert.equal(Math.min(...times),mode==='fine'&&id==='different'?2:4);
 }
});
test('histories are replayed and all optimal runs and reflection are needed',()=>{
 const s=createLockGranularity(),serial=['acquireA','acquireB','tick','tick','releaseA','tick','tick','releaseB'],parallel=['acquireA','acquireB','tick','tick','releaseA','releaseB'];
 for(const m of Object.keys(granularityModes))for(const id of Object.keys(granularityCases)){const key=`${m}:${id}`;s.histories[key]=m==='fine'&&id==='different'?parallel:serial;assert.ok(granularityTrialComplete(replayGranularity(m,id,s.histories[key])));}
 s.answer='tradeoff';s.checked=true;assert.ok(lockGranularityComplete(s));assert.deepEqual(restoreLockGranularity(s),s);assert.throws(()=>replayGranularity('coarse','same',['releaseA']));
});
