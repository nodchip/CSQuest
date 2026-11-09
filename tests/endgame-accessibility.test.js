import test from 'node:test';
import assert from 'node:assert/strict';
import {replayAccessibility} from '../src/endgame-accessibility.js';

test('a keyboard target, visible focus and meaningful name can be tested',()=>{
 const actions=['choose:button','test','choose:visible','test','choose:destination','test'];
 assert.deepEqual(replayAccessibility(actions).results,['button','visible','destination']);assert.equal(replayAccessibility(actions).done,true);
});
test('an unselected or unsuitable prototype cannot complete a trial',()=>{
 assert.equal(replayAccessibility(['test']),null);
 assert.equal(replayAccessibility(['choose:decoration','test']),null);
 assert.equal(replayAccessibility(['choose:button','test','choose:hidden','test']),null);
 assert.equal(replayAccessibility(['choose:button','test','choose:visible','test','choose:generic','test']),null);
 assert.equal(replayAccessibility(['choose:button','choose:decoration']).choice,'decoration');
});
