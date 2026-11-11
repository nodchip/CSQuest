import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayQuickStones as replay} from '../src/endgame-quick-stones.js';
const first=Array(21).fill('greater'),middle=['less','less','less','greater','greater','greater','less','greater','less','greater'],duplicates=['less','equal','less','less','equal','greater','less','greater'];
test('fixed partitions sort all stones and preserve duplicates with independent counts',()=>{
 for(const [kind,moves,array] of [['first',first,[1,2,3,4,5,6,7]],['middle',middle,[1,2,3,4,5,6,7]],['duplicates',duplicates,[1,2,3,4,4,4,5]]]){const s=replay(kind,[...moves,'check']);assert.equal(s.done,true);assert.deepEqual(s.trial.array,array);assert.equal(s.trial.comparisons,moves.length);assert.equal(replay(kind,[...moves,'check','reset']),null);}
});
test('wrong moves and premature checks are rejected, and saved moves replay and reset',()=>{
 assert.equal(replay('first',['less']),null);assert.equal(replay('middle',['check']),null);assert.equal(replay('duplicates',['equal']),null);
 const s=replay('middle',middle.slice(0,3));assert.deepEqual(s.trial.job.less,[1,2,3]);assert.equal(s.trial.job.rest[s.trial.job.index],5);
 assert.deepEqual(replay('middle',[...middle.slice(0,3),'reset']).trial, replay('middle',[]).trial);
});
