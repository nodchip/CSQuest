import test from 'node:test';
import assert from 'node:assert/strict';
import {replayListJourney,advanceListJourney} from '../src/endgame-list-journey.js';
test('independent version and identity expectations',()=>{
 const actions=['front','change'];
 const mutable=replayListJourney('mutable',actions).model,persistent=replayListJourney('persistent',actions).model;
 assert.deepEqual(mutable.lists.old.map(n=>n.value),[1,9,3]);
 assert.deepEqual(mutable.lists.front.map(n=>n.id),['X','A','B','C']);
 assert.deepEqual(persistent.lists.old.map(n=>n.value),[1,2,3]);
 assert.deepEqual(persistent.lists.changed.map(n=>n.value),[1,9,3]);
 assert.equal(persistent.lists.changed[2].id,persistent.lists.old[2].id);
 assert.equal(persistent.newForChange,2);assert.equal(mutable.newForChange,0);
 assert.equal(replayListJourney('mutable',[...actions,'answer:changed']).done,true);
 assert.equal(replayListJourney('persistent',[...actions,'answer:preserved']).done,true);
 assert.equal(replayListJourney('compare',['inspect:mutable','inspect:persistent','answer:share']).done,true);
});
test('reject wrong, early and repeated steps and restore',()=>{
 let h=[];assert.equal(advanceListJourney('persistent',h,'change'),null);h=advanceListJourney('persistent',h,'front');
 h=advanceListJourney('persistent',JSON.parse(JSON.stringify(h)),'change');assert.equal(advanceListJourney('persistent',h,'answer:changed'),null);
 assert.deepEqual(advanceListJourney('persistent',h,'reset'),[]);h=advanceListJourney('persistent',h,'answer:preserved');assert.equal(replayListJourney('persistent',h).done,true);assert.equal(advanceListJourney('persistent',h,'front'),null);
 assert.equal(replayListJourney('compare',['inspect:mutable','inspect:mutable']),null);
});
