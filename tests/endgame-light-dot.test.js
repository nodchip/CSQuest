import test from 'node:test';import assert from 'node:assert/strict';import {replayLightDot} from '../src/endgame-light-dot.js';
test('independent dot calculations for three nonzero rays',()=>{
 assert.deepEqual(replayLightDot('positive',['ray:sun','dot:2']),{phase:2,ray:'sun',value:2,done:true});
 assert.deepEqual(replayLightDot('zero',['ray:moon','dot:0']),{phase:2,ray:'moon',value:0,done:true});
 assert.deepEqual(replayLightDot('negative',['ray:shadow','dot:-5','angle:greater']),{phase:2,ray:'shadow',value:-5,done:true});
});
test('incorrect ray, dot, conclusion and post-completion histories fail',()=>{
 for(const [kind,h] of [['positive',['ray:moon']],['zero',['ray:moon','dot:2']],['negative',['ray:shadow','dot:-5','angle:right']],['positive',['ray:sun','dot:2','reset']],['negative',['dot:-5']]])assert.equal(replayLightDot(kind,h),null);
 assert.deepEqual(replayLightDot('negative',['ray:shadow','reset']),replayLightDot('negative',[]));
});
