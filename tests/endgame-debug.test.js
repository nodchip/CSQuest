import test from 'node:test';
import assert from 'node:assert/strict';
import {replayDebug} from '../src/endgame-debug.js';

test('trace identifies the first divergence for different inputs',()=>{
 assert.equal(replayDebug('trace',['step','mark']),null);
 const p=replayDebug('trace',['step','step']);assert.deepEqual([p.index,p.actual,p.expected],[2,2,1]);
 assert.equal(replayDebug('trace',['step','step','mark','next','step','mark','next']).done,true);
 assert.equal(replayDebug('trace',['step','step','step','mark']),null);
});
test('breakpoint pauses before processing and can be changed after a wrong choice',()=>{
 let p=replayDebug('breakpoint',['point:2','run']);assert.deepEqual([p.index,p.actual,p.expected,p.phase],[1,1,1,'paused']);
 p=replayDebug('breakpoint',['point:2','run','step']);assert.deepEqual([p.actual,p.expected],[2,1]);
 assert.equal(replayDebug('breakpoint',['point:1','run','step','mark']),null);
 const h=['point:1','run','step','reset','point:2','run','step','mark','next','point:1','run','step','mark','next'];assert.equal(replayDebug('breakpoint',h).done,true);
});
test('repair requires all cases including empty input and clears results when changing the rule',()=>{
 const h=['rule:all','test:0','test:1','test:2'];assert.equal(replayDebug('repair',[...h,'finish']),null);
 const p=replayDebug('repair',[...h,'rule:赤']);assert.deepEqual(p.tests,{});
 assert.equal(replayDebug('repair',[...h,'rule:赤','test:0','test:1','test:2','finish']).done,true);
 assert.equal(replayDebug('repair',['rule:赤','test:0','test:1','finish']),null);
});
