import test from 'node:test';
import assert from 'node:assert/strict';
import {cacheAffinitySchedule,affinityCases,affinityAssignments,createCacheAffinity,cacheAffinityComplete,restoreCacheAffinity} from '../src/cache-affinity.js';
test('cache and load both affect the completion time for all assignments',()=>{
 assert.deepEqual(affinityAssignments.map(a=>cacheAffinitySchedule('separate',a).makespan),[5,2,3,5]);
 assert.deepEqual(affinityAssignments.map(a=>cacheAffinitySchedule('together',a).makespan),[4,3,3,6]);
 const r=cacheAffinitySchedule('separate','00');assert.deepEqual(r.jobs.map(j=>[j.start,j.end,j.warm]),[[0,2,true],[2,5,false]]);assert.throws(()=>cacheAffinitySchedule('bad','00'));assert.throws(()=>cacheAffinitySchedule('together','02'));
});
test('completion requires all comparisons and a fastest assignment in each case',()=>{
 const s=createCacheAffinity();s.observed=Object.keys(affinityCases).flatMap(id=>affinityAssignments.map(a=>`${id}:${a}`));s.best={separate:'01',together:'10'};s.answer='tradeoff';s.checked=true;assert.ok(cacheAffinityComplete(s));assert.deepEqual(restoreCacheAffinity(s),s);s.best.together='00';assert.equal(cacheAffinityComplete(s),false);assert.throws(()=>restoreCacheAffinity({...s,observed:['separate:00','separate:00']}));
});
