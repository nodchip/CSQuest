import test from 'node:test';
import assert from 'node:assert/strict';
import {replayEigenJourney,advanceEigenJourney} from '../src/endgame-eigen-journey.js';
test('stretch, projection and rotation have the expected outputs',()=>{
 const stretch=['inspect:x','answer:2','inspect:y','answer:1','inspect:diagonal','answer:none','inspect:zero','answer:zero'];
 const flatten=['inspect:x','answer:1','inspect:y','answer:0','inspect:diagonal','answer:none','inspect:zero','answer:zero'];
 assert.deepEqual(replayEigenJourney('stretch',stretch).outputs,{x:[2,0],y:[0,1],diagonal:[2,1],zero:[0,0]});
 assert.deepEqual(replayEigenJourney('flatten',flatten).outputs,{x:[1,0],y:[0,0],diagonal:[1,0],zero:[0,0]});
 assert.ok(replayEigenJourney('stretch',stretch).done&&replayEigenJourney('flatten',flatten).done);
 const p=replayEigenJourney('rotate',['inspect:x','inspect:y','inspect:diagonal','answer:none']);
 assert.deepEqual(p.outputs,{x:[0,1],y:[-1,0],diagonal:[-1,1]});assert.equal(p.done,true);
});
test('incorrect choices, saved progress and reset',()=>{
 assert.equal(advanceEigenJourney('flatten',[],'answer:0'),null);
 let h=['inspect:y'];assert.equal(advanceEigenJourney('flatten',h,'answer:zero'),null);
 h=advanceEigenJourney('flatten',JSON.parse(JSON.stringify(h)),'answer:0');assert.equal(replayEigenJourney('flatten',h).answered.length,1);
 assert.deepEqual(advanceEigenJourney('flatten',h,'reset'),[]);
 assert.equal(advanceEigenJourney('rotate',['inspect:x'],'answer:none'),null);
});
