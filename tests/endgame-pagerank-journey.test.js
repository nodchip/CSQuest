import test from 'node:test';
import assert from 'node:assert/strict';
import {pagerankStep} from '../src/pagerank.js';
import {replayPagerankJourney,advancePagerankJourney} from '../src/endgame-pagerank-journey.js';
const close=(a,b)=>a.forEach((x,i)=>assert.ok(Math.abs(x-b[i])<1e-12,`${x} != ${b[i]}`));
test('independent two-step fractions and stationary vectors',()=>{
 const a=replayPagerankJourney('east',['step','answer:moon','step']);close(a.distribution,[10/75,31/75,34/75]);
 const b=replayPagerankJourney('west',['step','answer:moon','step']);close(b.distribution,[34/75,31/75,10/75]);
 for(const [k,v] of [['east',[16/120,55/120,49/120]],['west',[49/120,55/120,16/120]]])close(pagerankStep(k,v),v);
 assert.equal(replayPagerankJourney('east',['step','answer:moon','step','answer:sun']).done,true);
 assert.equal(replayPagerankJourney('west',['step','answer:moon','step','answer:star']).done,true);
});
test('reject incorrect moves and restore or reset progress',()=>{
 assert.equal(advancePagerankJourney('east',[],'answer:moon'),null);
 let h=['step'];assert.equal(advancePagerankJourney('east',h,'answer:star'),null);
 h=advancePagerankJourney('east',JSON.parse(JSON.stringify(h)),'answer:moon');assert.equal(replayPagerankJourney('east',h).answered,1);
 assert.deepEqual(advancePagerankJourney('east',h,'reset'),[]);
 assert.equal(advancePagerankJourney('compare',['inspect:east'],'answer:fixed'),null);
 assert.equal(replayPagerankJourney('compare',['inspect:east','inspect:west','answer:fixed']).done,true);
});
