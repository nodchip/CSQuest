import test from 'node:test';
import assert from 'node:assert/strict';
import {replayBloomJourney,advanceBloomJourney} from '../src/endgame-bloom-journey.js';
test('fixed bit positions distinguish absent and false positive',()=>{
 const h=['insert:moon','insert:antidote'];
 const p=replayBloomJourney('candidate',[...h,'inspect:moon','inspect:herb','inspect:fire']);
 assert.deepEqual(p.bits,[true,true,true,false,true,false]);
 assert.deepEqual(p.results,{moon:true,herb:true,fire:false});
 assert.deepEqual(p.stored,['moon','antidote']);
 assert.equal(replayBloomJourney('candidate',[...h,'inspect:herb','answer:verify']).done,true);
 assert.equal(replayBloomJourney('absent',[...h,'inspect:fire','answer:absent']).done,true);
 assert.equal(replayBloomJourney('register',[...h,'inspect:moon','answer:maybe']).done,true);
});
test('reject invalid steps and restore/reset without history accumulation',()=>{
 let h=[]; assert.equal(advanceBloomJourney('absent',h,'inspect:fire'),null);
 h=advanceBloomJourney('absent',h,'insert:moon');
 assert.equal(advanceBloomJourney('absent',h,'insert:moon'),null);
 h=advanceBloomJourney('absent',h,'insert:antidote');
 h=advanceBloomJourney('absent',JSON.parse(JSON.stringify(h)),'inspect:fire');
 assert.equal(advanceBloomJourney('absent',h,'answer:maybe'),null);
 for(let i=0;i<100;i++){h=advanceBloomJourney('absent',h,'reset');h=['insert:moon','insert:antidote','inspect:fire'];}
 h=advanceBloomJourney('absent',h,'answer:absent');
 assert.equal(replayBloomJourney('absent',h).done,true);
 assert.equal(advanceBloomJourney('absent',h,'reset'),null);
});
