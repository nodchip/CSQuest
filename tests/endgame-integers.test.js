import test from 'node:test';
import assert from 'node:assert/strict';
import {signed4,add4,replayIntegers} from '../src/endgame-integers.js';
test('four-bit interpretations include signed boundaries',()=>{
 assert.deepEqual([0,7,8,15].map(signed4),[0,7,-8,-1]);
 const history=['check','toggle:1','toggle:3','check','toggle:0','toggle:1','toggle:3','check','toggle:0','toggle:1','toggle:2','toggle:3','check'];
 assert.equal(replayIntegers('unsigned',history).done,true);
 assert.equal(replayIntegers('unsigned',['toggle:0','check']),null);
 assert.equal(replayIntegers('reading',['choose:15','check','choose:15','check']),null);
 assert.equal(replayIntegers('reading',['choose:15','check','choose:-1','check','choose:7','check','choose:-8','check']).done,true);
});
test('carry and signed overflow are different conditions',()=>{
 assert.deepEqual(add4(5,3),{value:8,carry:false,signedOverflow:true,signedSum:8});
 assert.deepEqual(add4(15,1),{value:0,carry:true,signedOverflow:false,signedSum:0});
 assert.deepEqual(add4(8,15),{value:7,carry:true,signedOverflow:true,signedSum:-9});
 assert.equal(add4(-1,3),null);
 const actions=['toggle:0','carry:no','overflow:yes','check','carry:yes','overflow:no','check','toggle:1','toggle:2','toggle:3','carry:yes','overflow:yes','check'];
 assert.equal(replayIntegers('addition',actions).done,true);
 assert.equal(replayIntegers('addition',['toggle:0','carry:yes','overflow:yes','check']),null);
 assert.equal(replayIntegers('addition',['toggle:0','carry:no','overflow:no','check']),null);
});
