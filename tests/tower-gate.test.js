import test from 'node:test';
import assert from 'node:assert/strict';
import {towerGateReplay as replay,validTowerGateDrafts,towerGateOpen,towerGateConverged,towerGateIds,accessPeople,originalWords,receivedWords} from '../src/tower-gate.js';

test('both destinations open after the three valley deliveries, not before',()=>{
 assert.equal(towerGateOpen(['data-record','data-filter']),false);
 assert.equal(towerGateOpen(['data-join','data-record','data-filter']),true);
 assert.equal(towerGateConverged(towerGateIds.slice(1)),false);
 assert.equal(towerGateConverged([...towerGateIds].reverse()),true);
});
test('forwarding uses the destination table, not the order of choices',()=>{
 assert.throws(()=>replay('tower-forward',['A:east']));
 assert.equal(replay('tower-forward',['A:west','B:east']).done,false);
 assert.equal(replay('tower-forward',['A:west','B:east','C:west']).done,true);
 assert.throws(()=>replay('tower-forward',['A:west','B:east','C:west','C:west']));
});
test('fragments require sequence numbers rather than arrival order',()=>{
 assert.throws(()=>replay('tower-packets',['2']));
 assert.deepEqual(replay('tower-packets',['1','2']).order,['1','2']);
 assert.equal(replay('tower-packets',['1','2','3']).done,true);
});
test('retransmission waits for an acknowledgement and handles a lost reply',()=>{
 const complete=['send','wait','send','wait','send','wait'];
 assert.equal(replay('tower-retry',complete.slice(0,-1)).done,false);
 assert.equal(replay('tower-retry',complete).done,true);
 assert.throws(()=>replay('tower-retry',['send','wait','wait']));
});
test('sender verification uses the trusted directory before the known contact',()=>{
 assert.throws(()=>replay('gate-verify',['call:message']));
 assert.throws(()=>replay('gate-verify',['directory','call:message']));
 assert.equal(replay('gate-verify',['directory','call:trusted','confirmed']).done,true);
});
test('least privilege requires exactly the rights each role needs',()=>{
 assert.deepEqual(accessPeople.map(p=>p.expected),[1,2,0]);
 let partial=['cycle:ren','cycle:yuno','check'];
 assert.equal(replay('gate-access',partial).done,false);
 assert.equal(replay('gate-access',[...partial,'cycle:yuno','check']).done,true);
 assert.equal(replay('gate-access',['cycle:ren','cycle:yuno','cycle:yuno','cycle:guest','check']).done,false);
});
test('integrity repair requires the differing token of the trusted original',()=>{
 assert.deepEqual(originalWords.map((x,i)=>x===receivedWords[i]),[true,false,true]);
 assert.throws(()=>replay('gate-integrity',['spot:0','restore']));
 assert.equal(replay('gate-integrity',['spot:0','spot:1','restore']).done,true);
});
test('draft validation rejects unknown, corrupt, overlong and post-completion histories',()=>{
 assert.equal(validTowerGateDrafts({'tower-packets':['1'],'gate-integrity':['spot:2']}),true);
 assert.equal(validTowerGateDrafts({'tower-packets':['2']}),false);
 assert.equal(validTowerGateDrafts({'gate-integrity':['spot:']}),false);
 assert.equal(validTowerGateDrafts({'tower-retry':Array(61).fill('send')}),false);
 assert.equal(validTowerGateDrafts({'unknown':[]}),false);
 assert.equal(validTowerGateDrafts([]),false);
});
