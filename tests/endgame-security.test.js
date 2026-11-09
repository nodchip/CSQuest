import test from 'node:test';
import assert from 'node:assert/strict';
import {replayAccess} from '../src/endgame-security.js';

test('identity, authorization, expiration and requested operation are separate checks',()=>{
 const actions=['identity','rights','allow','rights','identity','deny','identity','rights','deny','identity','rights','deny','identity','rights','deny','identity','rights','allow','identity','rights','deny'];
 const result=replayAccess(actions);assert.equal(result.done,true);assert.deepEqual(result.results,[true,false,false,false,false,true,false]);
 assert.equal(replayAccess([...actions,'allow']),null);
});
test('neither a valid identity nor an existing permission alone grants access',()=>{
 assert.equal(replayAccess(['allow']),null);
 assert.equal(replayAccess(['identity','allow']),null);
 assert.equal(replayAccess(['rights','allow']),null);
 assert.equal(replayAccess(['identity','rights','deny']),null);
 assert.equal(replayAccess(['identity','rights','allow','identity','rights','allow']),null);
 assert.equal(replayAccess(['identity','rights','allow','identity','rights','deny','identity','rights','allow']),null);
 const prefix=['identity','rights','allow','identity','rights','deny','identity','rights','deny'];
 assert.equal(replayAccess([...prefix,'identity','rights','allow']),null); // at expiration
 const beforeWrite=[...prefix,'identity','rights','deny','identity','rights','deny'];
 assert.equal(replayAccess([...beforeWrite,'identity','rights','allow']).results.at(-1),true);
 assert.equal(replayAccess([...beforeWrite,'identity','rights','deny']),null);
 assert.equal(replayAccess([...beforeWrite,'identity','rights','allow','identity','rights','allow']),null); // after expiration
});
