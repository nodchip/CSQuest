import test from 'node:test';
import assert from 'node:assert/strict';
import {replayTransaction} from '../src/endgame-transaction.js';
test('commit publishes both updates; partial commit cannot satisfy the request',()=>{
 assert.equal(replayTransaction('commit',['begin','debit','commit','check']),null);
 const h=['begin','debit','credit','commit','check','begin','debit','credit','commit','check'];
 assert.equal(replayTransaction('commit',h).done,true);
 assert.deepEqual(replayTransaction('commit',['begin','debit']).committed,[5,2]);
});
test('rollback discards one or both pending updates',()=>{
 const h=['begin','debit','rollback','check','begin','debit','credit','rollback','check'];
 assert.equal(replayTransaction('rollback',h).done,true);
 assert.equal(replayTransaction('rollback',['begin','debit','rollback','check','begin','debit','rollback','check','begin','debit','credit']),null);
 assert.deepEqual(replayTransaction('rollback',['begin','debit','credit','rollback']).committed,[5,2]);
});
test('fresh reads see committed state before and after commit or rollback',()=>{
 const h=['begin','debit','read','credit','commit','read','check','begin','debit','read','rollback','read','check'];
 assert.equal(replayTransaction('isolation',h).done,true);
 const p=replayTransaction('isolation',['begin','debit','read','credit','commit','read']);
 assert.deepEqual(p.reads.map(x=>x.values),[[5,2],[3,4]]);
 assert.equal(replayTransaction('isolation',['begin','debit','credit','commit','check']),null);
 const first=['begin','debit','read','credit','commit','read','check'];
 assert.equal(replayTransaction('isolation',[...first,'begin','debit','read','credit','rollback','read','check']),null);
});
