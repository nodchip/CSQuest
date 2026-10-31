import test from 'node:test';
import assert from 'node:assert/strict';
import {countingCases,createCountingTrial,stepCounting,createCountingSet,countingComplete,restoreCountingSet} from '../src/counting-sort.js';

test('counting, cumulative boundaries and reverse placement preserve the order of equal keys',()=>{
  const all=createCountingSet();for(const [id,example] of Object.entries(countingCases)){let s=createCountingTrial(id);for(const item of example.items)s=stepCounting(s,`count:${item.key}`);assert.equal(s.phase,'prefix');for(const key of [1,2])s=stepCounting(s,`prefix:${key}`);assert.deepEqual(s.counts,[example.items.filter(x=>x.key===0).length,example.items.filter(x=>x.key<=1).length,5]);while(s.phase==='place'){const key=example.items[s.cursor].key;s=stepCounting(s,`place:${s.counts[key]-1}`);}assert.deepEqual(s.output,example.items.slice().sort((a,b)=>a.key-b.key));all.trials[id]=s;}assert.ok(countingComplete(all));
});
test('wrong counts and placements do not advance; partial histories restore',()=>{
  let s=createCountingTrial('first');assert.equal(stepCounting(s,'count:0').history.length,0);for(const a of ['count:2','count:0'])s=stepCounting(s,a);const histories={first:s.history,second:[]};assert.deepEqual(restoreCountingSet({selected:'first',histories}).trials.first.counts,[1,0,1]);assert.throws(()=>restoreCountingSet({selected:'first',histories:{...histories,first:['count:0']}}));
});
