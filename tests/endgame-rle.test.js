import test from 'node:test';
import assert from 'node:assert/strict';
import {replayRle} from '../src/endgame-rle.js';
test('encoding joins only consecutive equal colours',()=>{
 assert.equal(replayRle('encode',['run:R:2']),null);
 assert.equal(replayRle('encode',['run:B:3']),null);
 assert.equal(replayRle('encode',['run:R:3','run:R:3']),null);
 assert.equal(replayRle('encode',['run:R:3','run:B:3','check','run:R:1','run:B:1','run:R:1','check']).done,true);
});
test('decoding preserves sequence and exact counts',()=>{
 assert.equal(replayRle('decode',['emit:B']),null);
 const h=['emit:R','emit:R','emit:R','emit:B','emit:B','emit:R','check','emit:B','emit:R','emit:R','check'];
 assert.equal(replayRle('decode',h).done,true);
});
test('fixed bit convention makes repeated data shorter and alternating data longer',()=>{
 const h=['run:R:8','judge:less','check','run:R:4','run:B:4','judge:equal','check',...['R','B','R','B','R','B','R','B'].map(x=>`run:${x}:1`),'judge:more','check'];
 assert.equal(replayRle('compare',h).done,true);
 assert.equal(replayRle('compare',['run:R:8','judge:more']),null);
 assert.equal(replayRle('compare',['run:R:8','check']),null);
 assert.deepEqual(replayRle('compare',['run:R:8','reset']).runs,[]);
});
