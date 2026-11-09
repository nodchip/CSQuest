import test from 'node:test';
import assert from 'node:assert/strict';
import {replayHash} from '../src/endgame-hash.js';
test('chaining keeps all colliding keys and checks the key within the bucket',()=>{
 const p=replayHash('chain',['put:1:1','put:4:1','put:7:1','seek:4','seek:7','seek:10']);assert.equal(p.done,true);assert.deepEqual(p.buckets,[[],[1,4,7],[]]);assert.match(p.last,/ありません/);
 assert.equal(replayHash('chain',['put:1:2']),null);
});
test('linear probing wraps and terminates after a full table',()=>{
 const h=['start','probe:1','start','probe:1','probe:2','start','probe:1','probe:2','probe:0','start','probe:1','probe:2','probe:0','start','probe:1','probe:2','probe:0'];
 const p=replayHash('linear',h);assert.equal(p.done,true);assert.deepEqual(p.slots,[7,1,4]);assert.deepEqual(p.results.map(r=>[r.key,r.found,r.probes]),[[1,true,1],[4,true,2],[7,true,3],[7,true,3],[10,false,3]]);
 assert.equal(replayHash('linear',['start','probe:0']),null);
});
test('an empty slot stops a search but a deletion marker does not',()=>{
 const h=['delete:empty','probe:1','probe:2','next','delete:mark','probe:1','probe:2','probe:0','next'];
 const p=replayHash('deletion',h);assert.equal(p.done,true);assert.deepEqual(p.results,[{found:false,probes:2},{found:true,probes:3}]);assert.equal(replayHash('deletion',['delete:mark']),null);
});
