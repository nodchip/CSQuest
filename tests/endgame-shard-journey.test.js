import test from 'node:test';
import assert from 'node:assert/strict';
import {replayShardJourney,advanceShardJourney} from '../src/endgame-shard-journey.js';
test('the two independent fixed placements and targets',()=>{
 const parity=['place:K1:left','place:K2:right','place:K3:left','place:K4:right'];
 const range=['place:K1:left','place:K2:left','place:K3:right','place:K4:right'];
 assert.deepEqual(replayShardJourney('parity',parity).trial.placed,{K1:'left',K2:'right',K3:'left',K4:'right'});
 assert.deepEqual(replayShardJourney('range',range).trial.placed,{K1:'left',K2:'left',K3:'right',K4:'right'});
 assert.equal(replayShardJourney('parity',[...parity,'query:point:left','query:range:both']).done,true);
 assert.equal(replayShardJourney('range',[...range,'query:point:right','query:range:left']).done,true);
 assert.equal(replayShardJourney('compare',['inspect:parity','inspect:range','answer:range']).done,true);
});
test('mistakes, saved progress and reset',()=>{
 assert.equal(advanceShardJourney('parity',[],'place:K1:right'),null);
 let h=['place:K1:left','place:K2:right','place:K3:left','place:K4:right'];
 assert.equal(advanceShardJourney('parity',h,'query:range:left'),null);
 h=advanceShardJourney('parity',JSON.parse(JSON.stringify(h)),'query:range:both');
 assert.equal(replayShardJourney('parity',h).trial.queries.range.length,2);
 assert.deepEqual(advanceShardJourney('parity',h,'reset'),[]);
 assert.equal(advanceShardJourney('compare',['inspect:parity'],'answer:range'),null);
});
