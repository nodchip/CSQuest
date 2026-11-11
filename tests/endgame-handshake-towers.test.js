import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayHandshakeTowers as replay,advanceHandshakeTowers as advance} from '../src/endgame-handshake-towers.js';
const histories={first:['send:syn:100:none','send:synack:500:101','send:ack:101:501'],second:['send:syn:20:none','send:synack:70:21','send:ack:21:71']};
test('fixed three-message exchanges use independently expected sequence and acknowledgment numbers',()=>{for(const [k,h] of Object.entries(histories)){assert.equal(replay(k,h).stage,3);assert.ok(replay(k,[...h,'check']).done);}assert.ok(replay('compare',['answer:next']).done);});
test('wrong message and sequence, premature check, duplicate, reset, and saved history',()=>{assert.equal(replay('first',['send:syn:100:101']),null);assert.equal(replay('second',['send:synack:70:21']),null);assert.equal(replay('first',['check']),null);assert.equal(replay('compare',['answer:next','answer:next']),null);let h=[];for(let i=0;i<30;i++){h=advance('first',h,'send:syn:100:none');h=advance('first',h,'reset');assert.deepEqual(h,[]);}h=advance('second',h,'send:syn:20:none');assert.equal(replay('second',JSON.parse(JSON.stringify(h))).stage,1);});
