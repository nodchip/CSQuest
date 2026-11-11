import test from 'node:test';import assert from 'node:assert/strict';import {replaySignedLamps} from '../src/endgame-signed-lamps.js';
const minus=['toggle:sign:0','toggle:sign:2','toggle:sign:3','toggle:twos:0','toggle:twos:1','toggle:twos:3','check'];
const zero=['toggle:sign:0','toggle:twos:0','check'],limit=['none:sign','toggle:twos:0','check'];
test('minus three, negative zero, and minus eight have the expected four-bit encodings',()=>{
 assert.deepEqual(replaySignedLamps('minus',minus).choices,{sign:{mask:11,none:false},twos:{mask:13,none:false}});
 assert.deepEqual(replaySignedLamps('zero',zero).choices,{sign:{mask:8,none:false},twos:{mask:8,none:false}});
 assert.deepEqual(replaySignedLamps('limit',limit).choices,{sign:{mask:0,none:true},twos:{mask:8,none:false}});
});
test('wrong forms, malformed actions and post-completion inputs are rejected',()=>{
 for(const [k,h] of [['minus',['check']],['zero',['toggle:sign:0','check']],['limit',['toggle:sign:0','toggle:twos:0','check']],['limit',['none:sign','toggle:sign:0']],['minus',[...minus,'reset']],['zero',['toggle:twos:4']]])assert.equal(replaySignedLamps(k,h),null);
 assert.deepEqual(replaySignedLamps('minus',['toggle:sign:0','reset']).choices,replaySignedLamps('minus',[]).choices);
});
