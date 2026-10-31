import {test} from 'node:test';
import assert from 'node:assert/strict';
import {performanceState,createPerformance,performanceComplete,restorePerformance} from '../src/latency-throughput.js';
test('four simultaneous requests have lower average latency serially but higher batch throughput in parallel',()=>{
 assert.deepEqual([1,2,3,4].map(t=>performanceState('serial',t).done),[1,2,3,4]);assert.deepEqual([1,2,3].map(t=>performanceState('batch',t).done),[0,0,4]);const a=performanceState('serial',4),b=performanceState('batch',3);assert.equal(a.mean,2.5);assert.equal(b.mean,3);assert.ok(4/a.elapsed<4/b.elapsed);assert.throws(()=>performanceState('batch',4),RangeError);
});
test('both measurements and both checked conclusions are required; restored data is copied',()=>{
 const s=createPerformance();s.ticks={serial:4,batch:3};s.latency='serial';s.throughput='batch';s.checked=true;const copy=restorePerformance(s);s.ticks.batch=2;assert.equal(performanceComplete(copy),true);assert.equal(performanceComplete(s),false);assert.throws(()=>restorePerformance({...copy,latency:'bad'}),RangeError);
});
