import test from 'node:test';
import assert from 'node:assert/strict';
import {replayEvents} from '../src/endgame-events.js';

test('dispatch calls the registered handler; missing registration stays visible',()=>{
 let p=replayEvents('register',['fire:river']);assert.deepEqual(p.log,[{type:'river',light:null}]);
 assert.equal(replayEvents('register',['bind:river:east','bind:port:west','fire:river','check']),null);
 const h=['bind:river:east','bind:port:west','fire:port','fire:river','check','bind:river:west','bind:port:east','fire:river','fire:port','check'];assert.equal(replayEvents('register',h).done,true);
});
test('toggle depends on state, and resetting or changing handler clears the trial',()=>{
 let p=replayEvents('toggle',['rule:on','press','press']);assert.equal(p.lit,true);assert.equal(replayEvents('toggle',['rule:on','press','press','check']),null);
 const h=['rule:on','press','rule:toggle','press','press','check','rule:toggle','press','check'];assert.equal(replayEvents('toggle',h).done,true);
 p=replayEvents('toggle',['rule:toggle','press','reset']);assert.equal(p.lit,false);assert.equal(p.presses,0);
});
test('the model dispatches in the stated arrival order and resets between cases',()=>{
 let p=replayEvents('queue',['dispatch']);assert.deepEqual(p.log.map(x=>x.id),['A']);assert.deepEqual(p.lights,{east:true,west:false});
 assert.equal(replayEvents('queue',['dispatch','next']),null);
 p=replayEvents('queue',['dispatch','dispatch','next','dispatch','dispatch','next']);assert.equal(p.done,true);assert.deepEqual(p.log.map(x=>x.id),['B','A']);assert.deepEqual(p.lights,{east:true,west:true});
});
