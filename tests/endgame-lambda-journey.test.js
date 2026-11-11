import test from 'node:test';
import assert from 'node:assert/strict';
import {replayLambdaJourney,advanceLambdaJourney} from '../src/endgame-lambda-journey.js';
test('identity reduction and capture avoiding renaming preserve free y',()=>{
 let p=replayLambdaJourney('simple',['choose:0']);assert.equal(p.result,'a');assert.equal(p.done,true);
 p=replayLambdaJourney('capture',['choose:0']);assert.equal(p.step.expression,'(λx.λz.x) y');
 p=replayLambdaJourney('capture',['choose:0','choose:2']);assert.equal(p.result,'λz.y');assert.equal(p.done,true);
 assert.equal(replayLambdaJourney('compare',['inspect:capture','inspect:simple','answer:fresh']).done,true);
});
test('wrong or premature steps rejected; save and reset',()=>{
 assert.equal(advanceLambdaJourney('simple',[],'choose:1'),null);
 assert.equal(advanceLambdaJourney('capture',[],'choose:2'),null);
 const h=JSON.parse(JSON.stringify(['choose:0']));assert.equal(replayLambdaJourney('capture',h).index,1);
 assert.deepEqual(advanceLambdaJourney('capture',h,'reset'),[]);
 assert.equal(advanceLambdaJourney('compare',['inspect:simple'],'answer:fresh'),null);
});
