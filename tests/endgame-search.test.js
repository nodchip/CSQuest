import test from 'node:test';
import assert from 'node:assert/strict';
import {replaySearch} from '../src/endgame-search.js';

test('linear and binary searches handle present, missing, and first numbers',()=>{
 const actions=[0,1,2,3,4,5,3,5,0,1,2,3,4,5,6,'missing',3,1,2,'missing',0,3,1,0];
 const result=replaySearch(actions);
 assert.equal(result.done,true);
 assert.deepEqual(result.counts,[6,2,7,3,1,3]);
 assert.equal(replaySearch([...actions,0]),null);
});
test('incorrect next cards and premature missing declarations do not advance',()=>{
 assert.equal(replaySearch(['missing']),null);
 assert.equal(replaySearch([1]),null);
 assert.equal(replaySearch([0,1,2,3,4,5,0]),null);
 assert.equal(replaySearch([0,1,2,3,4,5,3,5,0,1,2,3,4,5,6,0]),null);
 assert.deepEqual(replaySearch([0,1]).low,2);
});
