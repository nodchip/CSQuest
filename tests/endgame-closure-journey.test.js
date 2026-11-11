import test from 'node:test';
import assert from 'node:assert/strict';
import {replayClosureJourney,advanceClosureJourney} from '../src/endgame-closure-journey.js';
test('two separately created bindings give independent fixed results',()=>{
 const a=['create:old:2','create:recent:3','answer:old:8','answer:recent:12'];
 const b=['create:old:3','create:recent:1','answer:old:9','answer:recent:3'];
 assert.deepEqual([replayClosureJourney('first',a).old,replayClosureJourney('first',a).recent],[2,3]);
 assert.deepEqual([replayClosureJourney('second',b).old,replayClosureJourney('second',b).recent],[3,1]);
 assert.ok(replayClosureJourney('first',a).done&&replayClosureJourney('second',b).done);
 assert.ok(replayClosureJourney('compare',['inspect:first','inspect:second','answer:bindings']).done);
});
test('wrong or premature actions rejected; saved history and reset',()=>{
 assert.equal(advanceClosureJourney('first',[],'create:old:3'),null);
 const h=['create:old:2','create:recent:3'];assert.equal(advanceClosureJourney('first',h,'answer:old:12'),null);
 assert.equal(replayClosureJourney('first',JSON.parse(JSON.stringify(h))).old,2);
 assert.deepEqual(advanceClosureJourney('first',h,'reset'),[]);
 assert.equal(advanceClosureJourney('compare',['inspect:first'],'answer:bindings'),null);
});
