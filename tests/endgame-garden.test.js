import test from 'node:test';
import assert from 'node:assert/strict';
import {gardenAdvancedReady} from '../src/endgame-garden.js';
import {checkFourAnswer,festivalReady} from '../src/four-regions.js';

test('only two distinct garden basics unlock its next stage',()=>{
 assert.equal(gardenAdvancedReady([]),false);
 assert.equal(gardenAdvancedReady(['garden-sets','garden-sets','garden-counterexample']),false);
 assert.equal(gardenAdvancedReady(['garden-sets','garden-logic']),true);
});
test('the new garden requests cannot complete the old four-region festival',()=>{
 assert.equal(festivalReady(['garden-shelter','garden-lantern-rule']),false);
});
test('garden requests accept the combinations described in each independent scenario',()=>{
 const answers={'garden-shelter':[[1,2,3],[2],[1]],'garden-lantern-rule':[[0,2,3],[1],[1,2,3]]};
 for(const [id,scenarios] of Object.entries(answers))for(const [index,answer] of scenarios.entries()){
  assert.equal(checkFourAnswer(id,index,answer),true);
  assert.equal(checkFourAnswer(id,index,[]),false);
  assert.equal(checkFourAnswer(id,index,[...answer,answer[0]]),false);
 }
});
