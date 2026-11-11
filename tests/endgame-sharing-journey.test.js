import test from 'node:test';
import assert from 'node:assert/strict';
import {replaySharingJourney,advanceSharingJourney} from '../src/endgame-sharing-journey.js';
test('calculation timings and counts for two references',()=>{
 for(const [kind,start,first,second] of [['value',1,1,1],['name',0,1,2],['need',0,1,1]]){
  for(const [h,n] of [[['start'],start],[['start','use'],first],[['start','use','use'],second]])assert.equal(replaySharingJourney(kind,h).trial.calculations,n);
  const p=replaySharingJourney(kind,['start','use','use','return']);assert.equal(p.done,true);assert.equal(p.trial.uses,2);
 }
});
test('wrong order rejected, partial history restores and resets',()=>{
 assert.equal(advanceSharingJourney('need',[],'use'),null);
 assert.equal(advanceSharingJourney('value',['start'],'return'),null);
 const h=['start','use'];assert.equal(replaySharingJourney('need',JSON.parse(JSON.stringify(h))).trial.calculations,1);
 assert.deepEqual(advanceSharingJourney('need',h,'reset'),[]);
 assert.equal(advanceSharingJourney('name',['start','use','use','return'],'use'),null);
});
