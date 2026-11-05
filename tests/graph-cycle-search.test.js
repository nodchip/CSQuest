import test from 'node:test';
import assert from 'node:assert/strict';
import {cycleRoads,cycleSearchTrace} from '../src/graph-cycle-search.js';
import {createIterative,restoreIterative} from '../src/iterative-deepening.js';

test('marking on enqueue exhausts the reachable component while omitting marks repeats work',()=>{
 const marked=cycleSearchTrace('marked'),unmarked=cycleSearchTrace('unmarked');
 assert.deepEqual(marked.at(-1).visited,['S','A','B']);
 assert.deepEqual(marked.at(-1).queue,[]);assert.deepEqual(cycleRoads.G,[]);
 assert.deepEqual(unmarked.at(-1).visited,['S','A','S','B','A','A','S','B']);
 assert.deepEqual(unmarked.at(-1).queue,['S','B','A','A']);
 assert.ok(['S','A','B'].every(v=>cycleRoads[v].length>0&&cycleRoads[v].every(n=>n!=='G')));
 assert.ok(unmarked.every(t=>t.queue.length>0));
 assert.throws(()=>cycleSearchTrace('unknown'));
});
test('old search drafts retain progress; new comparison states are validated',()=>{
 const old=createIterative();delete old.cycleMethod;delete old.cyclePositions;delete old.cycleAnswer;delete old.cycleChecked;old.positions.breadth=3;
 const restored=restoreIterative(old);assert.equal(restored.positions.breadth,3);assert.deepEqual(restored.cyclePositions,{marked:0,unmarked:0});
 const saved=restoreIterative({...old,cycleMethod:'unmarked',cyclePositions:{marked:3,unmarked:8},cycleAnswer:'avoid',cycleChecked:true});
 assert.deepEqual(saved.cyclePositions,{marked:3,unmarked:8});assert.equal(saved.cycleChecked,true);
 assert.throws(()=>restoreIterative({...old,cyclePositions:{marked:4,unmarked:0}}));
 assert.throws(()=>restoreIterative({...old,cycleAnswer:null,cycleChecked:true}));
});
