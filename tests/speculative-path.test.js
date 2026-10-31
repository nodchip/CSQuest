import test from 'node:test';
import assert from 'node:assert/strict';
import {createSpeculativeTrial,stepSpeculative,speculativeCorrect,createSpeculative,speculativeComplete,restoreSpeculative} from '../src/speculative-path.js';

test('wrong-path work remains tentative and is discarded before correct-path commit',()=>{
  let s=createSpeculativeTrial('miss');s=stepSpeculative(s,'right');s=stepSpeculative(s,'speculate');assert.equal(s.tentative,5);assert.equal(s.visible,0);s=stepSpeculative(s,'resolve');assert.equal(s.squashed,true);assert.equal(s.tentative,null);assert.equal(s.visible,0);assert.equal(stepSpeculative(s,'commit').history.length,s.history.length);s=stepSpeculative(s,'replay');s=stepSpeculative(s,'commit');assert.equal(s.visible,2);assert.ok(speculativeCorrect(s));
  let hit=createSpeculativeTrial('hit');for(const action of ['left','speculate','resolve','commit'])hit=stepSpeculative(hit,action);assert.equal(hit.visible,2);assert.ok(speculativeCorrect(hit));const set=createSpeculative();set.trials={hit,miss:s};assert.ok(speculativeComplete(set));
});
test('saved execution replays and rejects impossible stage transitions',()=>{
  const histories={hit:[],miss:['right','speculate','resolve']};const s=restoreSpeculative({selected:'miss',histories}).trials.miss;assert.equal(s.phase,'replay');assert.equal(s.visible,0);assert.throws(()=>restoreSpeculative({selected:'miss',histories:{...histories,miss:['right','commit']}}));
});
