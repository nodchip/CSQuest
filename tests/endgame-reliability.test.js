import test from 'node:test';
import assert from 'node:assert/strict';
import {replayCopies,replayPipeline} from '../src/endgame-reliability.js';

test('repair uses the original majority and permits already-matching copies',()=>{
 assert.equal(replayCopies(['flip:0','flip:1','check']),null);
 assert.equal(replayCopies(['flip:2','check','flip:1','check','check','uncertain']).done,true);
 assert.equal(replayCopies(['check']),null);
});
test('two separate stations respect previous-tick dependency and compare completion times',()=>{
 assert.equal(replayPipeline(['A:1','B:1','tick']),null);
 const serial=['A:1','tick','B:1','tick','A:2','tick','B:2','tick','A:3','tick','B:3','tick','check'];
 const piped=['A:1','tick','A:2','B:1','tick','A:3','B:2','tick','B:3','tick','check'];
 const single=['A:1','tick','B:1','tick','check'];
 const result=replayPipeline([...serial,...piped,...single]);
 assert.equal(result.done,true);assert.deepEqual(result.results.map(x=>x.ticks.length),[6,4,2]);assert.deepEqual(result.results.map(x=>x.first),[2,2,2]);
 const otherOrder=['A:2','tick','A:3','B:2','tick','A:1','B:3','tick','B:1','tick','check'];
 assert.equal(replayPipeline([...serial,...otherOrder]).results[1].first,2);
 assert.equal(replayPipeline(['A:1','tick','A:1','tick']),null);
 assert.equal(replayPipeline(['A:1','tick','B:1','tick','check']),null);
});
