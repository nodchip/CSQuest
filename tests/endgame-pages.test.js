import test from 'node:test';
import assert from 'node:assert/strict';
import {replayPages} from '../src/endgame-pages.js';

test('the same virtual page uses each tool’s own table',()=>{
 const result=replayPages(['frame:2','frame:0','frame:1','unmapped']);
 assert.equal(result.done,true);assert.deepEqual(result.results,[2,0,1,null]);
});
test('an absent mapping cannot be guessed or confused with frame zero',()=>{
 assert.equal(replayPages(['frame:0']),null);
 assert.equal(replayPages(['frame:2','frame:0','frame:1','frame:0']),null);
 assert.equal(replayPages(['frame:2','frame:0','frame:1','unmapped','unmapped']),null);
});
