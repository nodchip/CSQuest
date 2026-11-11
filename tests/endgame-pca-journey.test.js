import test from 'node:test';
import assert from 'node:assert/strict';
import {replayPcaJourney,advancePcaJourney} from '../src/endgame-pca-journey.js';
test('independent captured and residual sums for four candidate axes',()=>{
 const seen=['inspect:x','inspect:y','inspect:diagonal','inspect:anti'];
 const d=replayPcaJourney('diagonal',seen),h=replayPcaJourney('horizontal',seen);
 assert.deepEqual(Object.values(d.results).map(x=>[x.captured,x.error]),[[10,10],[10,10],[18,2],[2,18]]);
 assert.deepEqual(Object.values(h.results).map(x=>[x.captured,x.error]),[[16,4],[4,16],[10,10],[10,10]]);
 assert.equal(replayPcaJourney('diagonal',[...seen,'answer:diagonal']).done,true);
 assert.equal(replayPcaJourney('horizontal',[...seen,'answer:x']).done,true);
 assert.equal(replayPcaJourney('compare',['inspect:diagonal','inspect:horizontal','answer:eigen']).done,true);
});
test('wrong or premature choice rejected; progress restores and resets',()=>{
 assert.equal(advancePcaJourney('diagonal',[],'answer:diagonal'),null);
 let h=['inspect:x','inspect:y','inspect:diagonal','inspect:anti'];
 assert.equal(advancePcaJourney('diagonal',h,'answer:x'),null);
 assert.equal(replayPcaJourney('diagonal',JSON.parse(JSON.stringify(h))).seen.length,4);
 assert.deepEqual(advancePcaJourney('diagonal',h,'reset'),[]);
 assert.equal(advancePcaJourney('compare',['inspect:diagonal'],'answer:eigen'),null);
});
