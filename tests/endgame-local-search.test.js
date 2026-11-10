import test from 'node:test';
import assert from 'node:assert/strict';
import {replayLocalSearch} from '../src/endgame-local-search.js';
test('greedy local minimum can miss a global minimum',()=>{
 assert.equal(replayLocalSearch('climb',['inspect:A','move:A']),null);
 assert.equal(replayLocalSearch('climb',['inspect:A','inspect:B','move:B']),null);
 const h=['inspect:A','inspect:B','move:A','inspect:S','check','next','inspect:A','move:A','inspect:S','inspect:G','move:G','check','next'];
 assert.equal(replayLocalSearch('climb',h).done,true);
});
test('changing start can escape the trap in this fixed graph',()=>{
 const h=['inspect:A','inspect:B','move:A','inspect:S','check','next','inspect:S','inspect:G','move:G','check','next'];
 assert.equal(replayLocalSearch('restart',h).done,true);
});
test('strict descent stops at a plateau while equal moves use visited protection',()=>{
 const h=['inspect:A','check','next','inspect:A','move:A','inspect:S','inspect:G','move:G','check','next'];
 assert.equal(replayLocalSearch('plateau',h).done,true);
 assert.equal(replayLocalSearch('plateau',['inspect:A','move:A']),null);
 assert.equal(replayLocalSearch('plateau',['inspect:A','check','next','inspect:A','move:A','inspect:S','inspect:G','move:S']),null);
});
