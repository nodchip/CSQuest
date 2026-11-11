import test from 'node:test';
import assert from 'node:assert/strict';
import {replaySvdJourney,advanceSvdJourney} from '../src/endgame-svd-journey.js';
test('fixed unit directions, outputs and independently calculated squared lengths',()=>{
 const h=['inspect:x','inspect:y','inspect:diagonal'];
 const turn=replaySvdJourney('turn',h),flat=replaySvdJourney('flat',h);
 assert.deepEqual(turn.results.x.output,[0,2]);assert.deepEqual(turn.results.y.output,[-1,0]);
 assert.deepEqual(flat.results.x.output,[1,0]);assert.deepEqual(flat.results.y.output,[0,0]);
 assert.ok(Math.abs(turn.results.diagonal.length**2-2.5)<1e-12);assert.ok(Math.abs(flat.results.diagonal.length**2-0.5)<1e-12);
 assert.equal(replaySvdJourney('turn',[...h,'answer:2,1']).done,true);
 assert.equal(replaySvdJourney('flat',[...h,'answer:1,0']).done,true);
 assert.equal(replaySvdJourney('compare',['inspect:turn','inspect:flat','answer:gram']).done,true);
});
test('wrong and premature answers rejected, saved history and reset',()=>{
 assert.equal(advanceSvdJourney('turn',[],'answer:2,1'),null);
 const h=['inspect:x','inspect:y','inspect:diagonal'];assert.equal(advanceSvdJourney('turn',h,'answer:1,0'),null);
 assert.equal(replaySvdJourney('turn',JSON.parse(JSON.stringify(h))).seen.length,3);
 assert.deepEqual(advanceSvdJourney('turn',h,'reset'),[]);
 assert.equal(advanceSvdJourney('compare',['inspect:turn'],'answer:gram'),null);
});
