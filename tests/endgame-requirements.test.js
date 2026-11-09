import test from 'node:test';
import assert from 'node:assert/strict';
import {replayRequirements} from '../src/endgame-requirements.js';
test('statements remain distinguishable from agreed requirements and can be corrected',()=>{
 const steps=['place:size:question','place:size:function','place:fast:question','place:find:function','place:time:condition','place:private:question','place:keyboard:condition','check'];
 assert.equal(replayRequirements('interview',steps).done,true);
 assert.equal(replayRequirements('interview',['place:size:condition','check']),null);
});
test('the two user stories use the person, goal and reason stated in each scene',()=>{
 const steps=['speaker:1','need:0','reason:1','check','speaker:0','need:1','reason:0','check'];
 assert.equal(replayRequirements('story',steps).done,true);
 assert.equal(replayRequirements('story',['speaker:0','need:0','reason:1','check']),null);
});
test('questions precede agreement and each person can access only their own reservation',()=>{
 assert.equal(replayRequirements('agreement',['check']),null);
 assert.equal(replayRequirements('agreement',['question:records','check']),null);
 assert.equal(replayRequirements('agreement',['question:records','question:viewers','check','choose:deny','check']),null);
 const steps=['question:viewers','question:records','check',...['allow','deny','allow','deny','allow','allow'].flatMap(x=>[`choose:${x}`,'check'])];
 assert.equal(replayRequirements('agreement',steps).done,true);
});
