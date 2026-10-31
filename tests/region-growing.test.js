import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRegion,stepRegion,regionCounts,regionComplete,restoreRegion} from '../src/region-growing.js';
test('growth removes isolated light but leaks to a connected bright neighbor and misses the dark pixel',()=>{
 const s=createRegion();for(const id of ['isolated','leak']){let t=s.trials[id];t=stepRegion(t,'global');t=stepRegion(t,'seed',5);while(!t.done)t=stepRegion(t,'grow');s.trials[id]=t;}assert.deepEqual(regionCounts(s.trials.isolated.visited),{tp:4,fp:0,fn:0});assert.deepEqual(regionCounts(s.trials.leak.visited),{tp:3,fp:1,fn:1});assert.equal(regionComplete(s),true);
});
test('seed choice, no eligible seed, history replay, and malformed save are handled',()=>{
 const s=createRegion();let t=stepRegion(s.trials.isolated,'seed',0);assert.equal(t.seed,null);t=stepRegion(t,'seed',3);t=stepRegion(t,'grow');assert.deepEqual(t.visited,[3]);assert.equal(t.done,true);s.trials.isolated=t;const copy=restoreRegion(s);assert.deepEqual(copy.trials.isolated.visited,[3]);assert.throws(()=>restoreRegion({...s,trials:{...s.trials,leak:{history:[['seed',99]]}}}),RangeError);
});
