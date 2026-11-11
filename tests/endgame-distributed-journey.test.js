import test from 'node:test';
import assert from 'node:assert/strict';
import {replayDistributedJourney,advanceDistributedJourney} from '../src/endgame-distributed-journey.js';
test('three distinct order rows, with six versus four transfer units',()=>{
 const all=replayDistributedJourney('all',['guess3','ship','join']);
 const semi=replayDistributedJourney('semi',['guess3','keys','filter','ship','join']);
 assert.equal(all.trial.sent,6);assert.equal(semi.trial.sent,4);
 assert.deepEqual(semi.trial.keys,[1,4]);assert.deepEqual(semi.trial.rows.map(x=>x.id),[1,4]);
 assert.deepEqual(all.trial.result.map(x=>[x.order,x.id]),[[1,1],[2,1],[3,4]]);
 assert.deepEqual(semi.trial.result,all.trial.result);assert.equal(semi.done,true);
 assert.equal(replayDistributedJourney('compare',['inspect:semi','inspect:all','answer:semi']).done,true);
});
test('reject incorrect steps, restore intermediate state and reset',()=>{
 assert.equal(advanceDistributedJourney('semi',[],'guess2'),null);
 assert.equal(advanceDistributedJourney('semi',['guess3'],'ship'),null);
 let h=JSON.parse(JSON.stringify(['guess3','keys']));h=advanceDistributedJourney('semi',h,'filter');
 assert.deepEqual(replayDistributedJourney('semi',h).trial.rows.map(x=>x.id),[1,4]);
 assert.deepEqual(advanceDistributedJourney('semi',h,'reset'),[]);
 assert.equal(advanceDistributedJourney('compare',['inspect:all'],'answer:semi'),null);
 assert.equal(advanceDistributedJourney('all',['guess3','ship','join'],'reset'),null);
});
