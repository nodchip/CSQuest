import test from 'node:test';
import assert from 'node:assert/strict';
import {replayQuorumJourney,advanceQuorumJourney} from '../src/endgame-quorum-journey.js';
test('all pairs overlap and a disjoint single read can return an old value',()=>{
 for(const w of ['AB','AC','BC'])for(const r of ['AB','AC','BC']){
  const p=replayQuorumJourney('overlap',[`write:${w}`,`read:${r}:3`]);assert.equal(p.done,true);assert.ok([...w].some(x=>r.includes(x)));
 }
 for(const w of ['A','B','C'])for(const r of ['A','B','C'])if(w!==r)assert.equal(replayQuorumJourney('single',[`write:${w}`,`read:${r}:4`]).done,true);
 assert.equal(replayQuorumJourney('compare',['inspect:single','inspect:overlap','answer:overlap']).done,true);
});
test('incorrect operations rejected, progress restored and reset',()=>{
 assert.equal(advanceQuorumJourney('overlap',[],'write:A'),null);
 let h=['write:AB'];assert.equal(advanceQuorumJourney('overlap',h,'read:BC:4'),null);
 h=advanceQuorumJourney('overlap',JSON.parse(JSON.stringify(h)),'read:BC:3');assert.equal(replayQuorumJourney('overlap',h).done,true);
 assert.equal(advanceQuorumJourney('overlap',h,'reset'),null);
 assert.deepEqual(advanceQuorumJourney('single',['write:A'],'reset'),[]);
 assert.equal(advanceQuorumJourney('compare',['inspect:single'],'answer:overlap'),null);
});
