import test from 'node:test';
import assert from 'node:assert/strict';
import {replayHeap} from '../src/endgame-heap.js';
test('priority queue takes minimum rather than arrival order',()=>{
 assert.equal(replayHeap('queue',['take:4']),null);
 assert.equal(replayHeap('queue',['take:1','take:3','take:4','check','take:2','take:3','take:5','check']).done,true);
});
test('insertion bubbles up only while smaller than its parent',()=>{
 const h=['add','swap:2','swap:0','check','add','check'];
 assert.equal(replayHeap('insert',h).done,true);
 assert.equal(replayHeap('insert',['add','check']),null);
 assert.equal(replayHeap('insert',['add','swap:0']),null);
 assert.deepEqual(replayHeap('insert',['add','swap:2','swap:0']).items,[1,5,2,9,7,3]);
});
test('removal moves the last item and follows the smaller child',()=>{
 assert.deepEqual(replayHeap('remove',['remove','swap:2']).items,[3,4,5,7]);
 assert.equal(replayHeap('remove',['remove','swap:1']),null);
 const h=['remove','swap:2','check','remove','swap:1','swap:3','check'];
 assert.equal(replayHeap('remove',h).done,true);
 assert.deepEqual(replayHeap('remove',h.slice(0,-1)).items,[3,5,4,7,6]);
});
