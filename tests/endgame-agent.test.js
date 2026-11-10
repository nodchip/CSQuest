import test from 'node:test';
import assert from 'node:assert/strict';
import {replayAgent} from '../src/endgame-agent.js';
test('changing a rule invalidates trials, and both weather cases must be tested',()=>{
 const h=['set:sun:shelter','test:sun','set:sun:outside','set:rain:shelter'];
 assert.deepEqual(replayAgent('rule',h).trials,{});
 assert.equal(replayAgent('rule',[...h,'test:sun','check']),null);
 assert.equal(replayAgent('rule',[...h,'test:sun','test:rain','check']).done,true);
});
test('cloud alone cannot distinguish the two fixed states; the model sensor reveals each',()=>{
 assert.equal(replayAgent('observe',['cloud','choose:outside']),null);
 assert.equal(replayAgent('observe',['sensor']),null);
 const h=['cloud','sensor','choose:outside'];
 assert.equal(replayAgent('observe',h).scene,1);
 assert.equal(replayAgent('observe',[...h,'cloud','sensor','choose:shelter']).done,true);
 assert.equal(replayAgent('observe',[...h,'cloud','sensor','choose:outside']),null);
});
test('given losses make outside optimal at 20% and shelter at 50%',()=>{
 assert.equal(replayAgent('risk',['choose:shelter']),null);
 assert.equal(replayAgent('risk',['choose:outside','choose:outside']),null);
 assert.equal(replayAgent('risk',['choose:outside','choose:shelter']).done,true);
});
