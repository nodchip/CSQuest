import test from 'node:test';
import assert from 'node:assert/strict';
import {replayInvariant} from '../src/endgame-invariant.js';

test('trace preserves count through red and blue and accepts an empty input',()=>{
 const h=['step','step','step'];
 assert.deepEqual([replayInvariant('trace',h).i,replayInvariant('trace',h).c],[3,2]);
 assert.equal(replayInvariant('trace',['check']),null);
 assert.equal(replayInvariant('trace',[...h,'check','check']).done,true);
 assert.equal(replayInvariant('trace',['step','reset']).c,0);
});
test('proof requires initialization, maintenance, conclusion and termination',()=>{
 assert.equal(replayInvariant('proof',['card:1']),null);
 assert.equal(replayInvariant('proof',['card:0','card:1','card:2','check']),null);
 assert.equal(replayInvariant('proof',['card:0','card:1','card:2','card:3','check']).done,true);
});
test('off-by-one misses the final red and the correct loop processes it',()=>{
 const p=replayInvariant('compare',['step-wrong','step-wrong','step-correct','step-correct','step-correct']);
 assert.deepEqual([p.wrongCount,p.correctCount],[1,2]);
 assert.equal(replayInvariant('compare',['step-wrong','step-wrong','step-wrong']),null);
 assert.equal(replayInvariant('compare',['step-wrong','step-wrong','step-correct','step-correct','step-correct','check']).done,true);
});
