import test from 'node:test';
import assert from 'node:assert/strict';
import {replayStreamJourney,advanceStreamJourney} from '../src/endgame-stream-journey.js';
test('fixed finite and infinite generation counts',()=>{
 let p=replayStreamJourney('eager',['prepare','take','take']);assert.deepEqual([p.first.generated,p.first.taken,p.done],[4,2,true]);
 p=replayStreamJourney('lazy',['take','take']);assert.deepEqual([p.first.generated,p.first.taken,p.done],[2,2,true]);
 p=replayStreamJourney('infinite',['eager:prepare','lazy:take','lazy:take','lazy:take','answer:prefix']);
 assert.deepEqual([p.first.stuck,p.first.taken,p.second.generated,p.second.taken,p.done],[true,0,3,3,true]);
});
test('wrong or premature operations rejected; saved history and reset',()=>{
 assert.equal(advanceStreamJourney('eager',[],'take'),null);
 assert.equal(advanceStreamJourney('lazy',[],'prepare'),null);
 const h=['eager:prepare','lazy:take'];assert.equal(advanceStreamJourney('infinite',h,'answer:prefix'),null);
 assert.equal(replayStreamJourney('infinite',JSON.parse(JSON.stringify(h))).second.taken,1);
 assert.deepEqual(advanceStreamJourney('infinite',h,'reset'),[]);
 assert.equal(advanceStreamJourney('lazy',['take','take'],'take'),null);
});
