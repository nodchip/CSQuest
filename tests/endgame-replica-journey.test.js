import test from 'node:test';
import assert from 'node:assert/strict';
import {replayReplicaJourney,advanceReplicaJourney} from '../src/endgame-replica-journey.js';
test('independent expected snapshots of write, partition, repair and delivery',()=>{
 const initial=replayReplicaJourney('delivery',[]).model;
 assert.deepEqual([initial.primary,initial.replica,initial.partition,initial.pending],[4,4,true,false]);
 const history=['write','readReplica','deliver','heal'];
 let p=replayReplicaJourney('delivery',history);
 assert.deepEqual([p.model.primary,p.model.replica,p.model.partition,p.model.pending],[3,4,false,true]);
 p=replayReplicaJourney('delivery',[...history,'deliver','readReplica','check']);
 assert.deepEqual([p.model.primary,p.model.replica,p.model.pending,p.done],[3,3,false,true]);
});
test('checks require observations, reject errors and restore or reset safely',()=>{
 assert.equal(advanceReplicaJourney('stale',[],'check'),null);
 assert.equal(advanceReplicaJourney('stale',[],'deliver'),null);
 const stale=['write','readReplica','readPrimary'];
 assert.equal(replayReplicaJourney('stale',[...stale,'check']).done,true);
 const part=['write','readReplica','deliver','heal'];
 assert.equal(advanceReplicaJourney('compare',part,'answer:delayed'),null);
 let h=JSON.parse(JSON.stringify(part));h=advanceReplicaJourney('compare',h,'deliver');h=advanceReplicaJourney('compare',h,'readReplica');
 assert.equal(advanceReplicaJourney('compare',h,'answer:instant'),null);
 h=advanceReplicaJourney('compare',h,'answer:delayed');
 assert.equal(replayReplicaJourney('compare',h).done,true);
 assert.equal(advanceReplicaJourney('compare',h,'reset'),null);
 assert.deepEqual(advanceReplicaJourney('delivery',part,'reset'),[]);
});
