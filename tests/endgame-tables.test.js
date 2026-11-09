import test from 'node:test';
import assert from 'node:assert/strict';
import {replayTables} from '../src/endgame-tables.js';

test('union, intersection and directed difference include duplicate and empty cases',()=>{
 const actions=['choose:40','choose:20','choose:30','choose:10','check','choose:20','check','choose:30','choose:10','check','check','choose:30','check','check'];
 const result=replayTables(actions);assert.equal(result.done,true);assert.deepEqual(result.results.map(x=>[...x].sort((a,b)=>a-b)),[[10,20,30,40],[20],[10,30],[],[30],[]]);
});
test('missing or extra numbers do not complete a scene',()=>{
 assert.equal(replayTables(['check']),null);
 assert.equal(replayTables(['choose:50']),null);
 assert.equal(replayTables(['choose:10','choose:20','choose:30','check']),null);
 assert.equal(replayTables(['choose:10','choose:10']).selected.length,0);
});
