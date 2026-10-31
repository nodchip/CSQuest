import test from 'node:test';
import assert from 'node:assert/strict';
import {regions,storyProgress} from '../src/world.js';

test('story advances by distinct places, regardless of quest or visit order',()=>{
  assert.equal(storyProgress([]).current.id,'beginning');
  const samePlace=storyProgress(['sequence','branch','sequence','unknown']);assert.equal(samePlace.visited.length,1);assert.equal(samePlace.current.id,'first-light');
  const four=regions.slice(0,4).map(region=>region.quests[0]);assert.equal(storyProgress(four).current.id,'connections');
  assert.equal(storyProgress([...four].reverse()).current.id,'connections');
  const eight=regions.map(region=>region.quests.at(-1));const done=storyProgress(eight);assert.equal(done.current.id,'beacon');assert.equal(done.next,null);assert.equal(done.scenes.length,4);
});
