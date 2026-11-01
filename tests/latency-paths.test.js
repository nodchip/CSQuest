import {test} from 'node:test';
import assert from 'node:assert/strict';
import {latencyPaths,latencyTotal,createLatencyPaths,latencyComplete,restoreLatencyPaths} from '../src/latency-paths.js';
import {restoreCache} from '../src/cache.js';
test('the fixed paths include both network directions and their ordering changes',()=>{
 assert.deepEqual(Object.keys(latencyPaths).map(latencyTotal),[2,100,14,124]);assert.ok(latencyTotal('near')<latencyTotal('disk'));assert.ok(latencyTotal('far')>latencyTotal('disk'));assert.throws(()=>latencyTotal('bad'),RangeError);
});
test('every checked route and the conditional comparison are required and records validate',()=>{
 const s=createLatencyPaths();for(const id of Object.keys(latencyPaths)){s.choices[id]=latencyTotal(id);s.checked[id]=true;}s.answer='depends';assert.equal(latencyComplete(s),false);s.confirmed=true;const copy=restoreLatencyPaths(s);s.choices.near=100;assert.equal(latencyComplete(s),false);assert.equal(latencyComplete(copy),true);assert.throws(()=>restoreLatencyPaths({...copy,answer:'bad'}),RangeError);
 assert.deepEqual(restoreCache({selected:'grouped',index:{grouped:1,rotating:0}}).latency,createLatencyPaths());
});
