import test from 'node:test';
import assert from 'node:assert/strict';
import {replayUsability} from '../src/endgame-usability.js';

test('the trial addresses observed ambiguity, then distinguishes evaluation purposes',()=>{
 const actions=['choose:specific','test','choose:improve','test','choose:judge','test'];
 assert.equal(replayUsability(actions).done,true);
});
test('the wrong evaluation purpose or an unselected alternative does not advance',()=>{
 assert.equal(replayUsability(['test']),null);
 assert.equal(replayUsability(['choose:vague','test']),null);
 assert.equal(replayUsability(['choose:specific','test','choose:judge','test']),null);
 assert.equal(replayUsability(['choose:specific','test','choose:improve','test','choose:improve','test']),null);
});
