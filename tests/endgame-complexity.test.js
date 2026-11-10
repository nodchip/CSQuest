import test from 'node:test';
import assert from 'node:assert/strict';
import {replayComplexity} from '../src/endgame-complexity.js';

test('linear search counts first, last and absent independently of input size',()=>{
 const h=['probe:1','next','probe:1','probe:2','probe:3','probe:4','next',...Array.from({length:8},(_,i)=>`probe:${i+1}`),'next'];
 assert.deepEqual(replayComplexity('linear',h).results.map(x=>[x.count,x.found]),[[1,true],[4,true],[8,false]]);
 assert.equal(replayComplexity('linear',['probe:2']),null);
});
test('binary search halves the sorted range until it is empty',()=>{
 const h=['probe:4','probe:6','probe:7','next','probe:8','probe:12','probe:14','probe:15','next'];
 const p=replayComplexity('binary',h);assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>[x.count,x.found]),[[3,false],[4,false]]);
 assert.equal(replayComplexity('binary',['probe:5']),null);
});
test('one comparison can beat binary on the first item, but not on the absent item',()=>{
 const h=['probe:1','next','probe:4','probe:2','probe:1','next',...Array.from({length:7},(_,i)=>`probe:${i+1}`),'next','probe:4','probe:6','probe:7','next'];
 const p=replayComplexity('compare',h);assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>x.count),[1,3,7,3]);assert.deepEqual(p.results.map(x=>x.found),[true,true,false,false]);
 assert.equal(replayComplexity('compare',['next']),null);
});
