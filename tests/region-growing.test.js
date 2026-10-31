import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRegion,stepRegion,regionCounts,regionComplete,restoreRegion} from '../src/region-growing.js';
test('growth removes isolated light but leaks to a connected bright neighbor and misses the dark pixel',()=>{
 const s=createRegion();for(const id of ['isolated','leak']){let t=s.trials[id];t=stepRegion(t,'global');t=stepRegion(t,'seed',5);while(!t.done)t=stepRegion(t,'grow');assert.equal(regionComplete({...s,trials:{...s.trials,[id]:t}}),false);t=stepRegion(t,'cluster');assert.equal(t.clusterStable,false);t=stepRegion(t,'cluster');assert.equal(t.clusterStable,true);s.trials[id]=t;}assert.deepEqual(regionCounts(s.trials.isolated.visited),{tp:4,fp:0,fn:0});assert.deepEqual(regionCounts(s.trials.leak.visited),{tp:3,fp:1,fn:1});assert.deepEqual(s.trials.isolated.centers,[0,2.4]);assert.deepEqual(s.trials.leak.centers,[0,2.25]);assert.deepEqual(regionCounts(s.trials.isolated.clusterPixels),{tp:4,fp:1,fn:0});assert.deepEqual(regionCounts(s.trials.leak.clusterPixels),{tp:3,fp:1,fn:1});assert.equal(regionComplete(s),true);
});
test('seed choice, no eligible seed, history replay, and malformed save are handled',()=>{
 const s=createRegion();let t=stepRegion(s.trials.isolated,'seed',0);assert.equal(t.seed,null);t=stepRegion(t,'seed',3);t=stepRegion(t,'grow');assert.deepEqual(t.visited,[3]);assert.equal(t.done,true);s.trials.isolated=t;const copy=restoreRegion(s);assert.deepEqual(copy.trials.isolated.visited,[3]);assert.throws(()=>restoreRegion({...s,trials:{...s.trials,leak:{history:[['seed',99]]}}}),RangeError);
});
test('clustering restores mid-iteration and older histories remain readable',()=>{
 const s=createRegion();s.trials.isolated=stepRegion(s.trials.isolated,'cluster');const restored=restoreRegion(s);assert.deepEqual(restored.trials.isolated.centers,[0,2.4]);assert.equal(restored.trials.isolated.clusterStable,false);assert.equal(stepRegion(restored.trials.isolated,'cluster').clusterStable,true);const old=createRegion();old.trials.leak=stepRegion(old.trials.leak,'global');assert.equal(restoreRegion(old).trials.leak.clusterSteps,0);
});
