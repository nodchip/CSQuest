import test from 'node:test';
import assert from 'node:assert/strict';
import {replayCount,replayJoin} from '../src/endgame-cooperation.js';

test('two reads of the old number can lose an update; either serial order works',()=>{
 const lost=['A','B','A','B','A','B','check'];
 assert.equal(replayCount(lost).results[0].shared,1);
 const result=replayCount([...lost,'B','B','B','A','A','A','check','A','A','A','B','B','B','check']);
 assert.deepEqual(result.results.map(r=>r.shared),[1,2,7]);assert.equal(result.done,true);
 assert.equal(replayCount(['A','A','A','B','B','B','check']),null);
 assert.equal(replayCount(['A','A','A','A']),null);
 assert.equal(replayCount(['A','reset']).state.people.A.step,0);
});
test('shared lock excludes the other worker until after the write and release',()=>{
 assert.equal(replayCount(['A','B'],true),null);
 assert.equal(replayCount(['A','A','A','A','B'],true),null);
 const h=['B','B','B','B','B','A','A','A','A','A','check','A','A','A','A','A','B','B','B','B','B','check'];
 assert.deepEqual(replayCount(h,true).results.map(r=>r.shared),[2,7]);assert.equal(replayCount(h,true).done,true);
});
test('send requires both distinct completions, in either order',()=>{
 assert.equal(replayJoin(['send']),null);assert.equal(replayJoin(['A','send']),null);assert.equal(replayJoin(['B','send']),null);assert.equal(replayJoin(['A','A']),null);
 assert.equal(replayJoin(['B','A','send','A','send']).done,true);
 assert.equal(replayJoin(['A','B','send','A','send']).done,true);
});
