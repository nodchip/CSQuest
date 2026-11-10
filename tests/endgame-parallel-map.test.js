import test from 'node:test';
import assert from 'node:assert/strict';
import {replayParallelMap} from '../src/endgame-parallel-map.js';
test('each distinct card is transformed once, including zero and repeated values',()=>{
 assert.equal(replayParallelMap('map',['map:0','map:0']),null);
 assert.equal(replayParallelMap('map',['map:0','check']),null);
 const partial=['map:2','map:0'];assert.deepEqual(replayParallelMap('map',JSON.parse(JSON.stringify(partial))).mapped,[2,null,6,null]);
 const done=[...partial,'map:3','map:1','check','map:0','map:1','map:2','map:3','check'];const r=replayParallelMap('map',done);assert.equal(r.done,true);assert.deepEqual(r.results.map(x=>x.mapped),[[2,4,6,8],[0,4,2,4]]);assert.equal(replayParallelMap('map',[...done,'check']),null);
});
test('two partial sums can be made in either order, and both precede final sum',()=>{
 assert.equal(replayParallelMap('reduce',['pair:0','combine']),null);
 assert.equal(replayParallelMap('reduce',['pair:0','pair:0']),null);
 const done=['pair:1','pair:0','combine','check','pair:0','pair:1','combine','check'],r=replayParallelMap('reduce',done);assert.equal(r.done,true);assert.deepEqual(r.results.map(x=>[x.pairs,x.total]),[[[3,7],10],[[4,4],8]]);
});
test('fixed pipeline waits for every map and preserves both equal-value cards',()=>{
 assert.equal(replayParallelMap('pipeline',['map:0','map:1','pair:0']),null);
 const partial=['map:0','map:1','map:2'];assert.deepEqual(replayParallelMap('pipeline',[...partial,'reset']).mapped,[null,null,null,null]);
 const stage=['map:0','map:1','map:2','map:3','pair:1','pair:0','combine','check'];const r=replayParallelMap('pipeline',[...stage,...stage]);assert.equal(r.done,true);assert.deepEqual(r.results.map(x=>[x.mapped,x.pairs,x.total]),[[[2,4,6,8],[6,14],20],[[0,4,2,4],[4,6],10]]);
});
