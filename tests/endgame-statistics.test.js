import test from 'node:test';
import assert from 'node:assert/strict';
import {summarize,replayStatistics} from '../src/endgame-statistics.js';
test('mean, median and range are distinct and even medians average both middle values',()=>{
 assert.deepEqual(summarize([1,2,3,4,10]),{mean:4,median:3,range:9});
 assert.deepEqual(summarize([1,2,3,4,5,9]),{mean:4,median:3.5,range:8});
 assert.equal(summarize([]),null);
});
test('frequency shelves can be corrected and require every observation',()=>{
 assert.equal(replayStatistics('frequency',['place:0:2','check']),null);
 const actions=['place:0:2','place:0:3','place:1:1','place:2:3','place:3:2','place:4:1','place:5:3','check','place:0:2','place:1:3','place:2:2','place:3:1','place:4:3','place:5:2','check'];
 assert.deepEqual(replayStatistics('frequency',actions).results.map(x=>x.counts),[{1:2,2:1,3:3},{1:1,2:3,3:2}]);
});
test('order must be nondecreasing and distinct equal observations remain separate',()=>{
 assert.equal(replayStatistics('center',['pick:0','pick:1','pick:2','pick:3','pick:4','check']),null);
 assert.equal(replayStatistics('center',['pick:0','pick:0']),null);
 assert.equal(replayStatistics('center',['undo']),null);
 const scene=['pick:1','pick:4','pick:3','pick:0','pick:2','check'];
 assert.equal(replayStatistics('center',[...scene,'mean:3','median:3','check']),null);
 assert.deepEqual(replayStatistics('center',[...scene,'mean:4','median:3','check',...scene,'mean:3','median:3','check']).results.map(x=>[x.mean,x.median]),[[4,3],[3,3]]);
});
test('same center does not imply the same range',()=>{
 const actions=['place:0:3','place:1:1','place:2:5','place:3:2','place:4:4','place:5:3','check','range:4','check','place:0:4','place:1:2','place:2:3','place:3:2','place:4:4','place:5:3','check','range:2','check'];
 assert.deepEqual(replayStatistics('spread',actions).results.map(x=>[x.mean,x.median,x.range]),[[3,3,4],[3,3,2]]);
});
