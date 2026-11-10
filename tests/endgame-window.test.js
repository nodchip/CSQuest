import test from 'node:test';
import assert from 'node:assert/strict';
import {replayWindow} from '../src/endgame-window.js';
const initial=['send:1','send:2','send:3'];
test('three sends fit before a cumulative reply is delivered',()=>{
 const p=replayWindow('clean',initial);assert.equal(p.state.base,1);assert.deepEqual(p.state.received,[1,2,3]);assert.deepEqual(p.state.pendingAcks,[1,2,3]);
 const q=replayWindow('clean',[...initial,'ack:3']);assert.equal(q.done,true);assert.equal(q.state.base,4);assert.equal(replayWindow('clean',[...initial,'ack:3','send:1']),null);
});
test('lost second data makes third out of order, so ACK 1 cannot acknowledge either',()=>{
 const p=replayWindow('gap',initial);assert.deepEqual(p.state.received,[1]);assert.deepEqual(p.state.discarded,[3]);assert.deepEqual(p.state.pendingAcks,[1,1]);
 assert.equal(replayWindow('gap',[...initial,'ack:3']),null);const q=replayWindow('gap',[...initial,'ack:1']);assert.equal(q.done,true);assert.equal(q.state.base,2);
});
test('after ACK 1 and timeout, retransmit both unconfirmed packets',()=>{
 const partial=[...initial,'ack:1'];assert.equal(replayWindow('retry',[...partial,'resend:2']),null);
 const restored=replayWindow('retry',JSON.parse(JSON.stringify([...partial,'timeout'])));assert.equal(restored.state.base,2);assert.equal(restored.state.timedOut,true);
 assert.equal(replayWindow('retry',[...partial,'timeout','resend:3']),null);
 const p=replayWindow('retry',[...partial,'timeout','resend:2','resend:3','ack:3']);assert.equal(p.done,true);assert.deepEqual(p.state.sent,[1,2,3,2,3]);assert.deepEqual(p.state.received,[1,2,3]);assert.equal(p.state.base,4);
});
