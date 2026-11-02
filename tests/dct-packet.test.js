import {test} from 'node:test';
import assert from 'node:assert/strict';
import {packetBlocks,packetInitial,packetExecute,packetDecode,packetReplay,packetCreate,packetStep,packetVerify,packetComplete,packetRestore} from '../src/dct-packet.js';

test('every possible treatment of trailing zeros decodes the same three blocks',()=>{
 for(let first=0;first<=2;first++)for(let second=0;second<=3;second++){
  const h=['dc:20','emit',...Array(first).fill('skip'),'end','dc:0',...Array(second).fill('skip'),'end','dc:4','skip','skip','emit'];
  const s=packetReplay(h);assert.equal(s.phase,'done');assert.deepEqual(s.tokens,[{kind:'dc',value:20},{kind:'ac',run:0,value:-4},{kind:'end'},{kind:'dc',value:0},{kind:'end'},{kind:'dc',value:4},{kind:'ac',run:2,value:-4}]);assert.deepEqual(packetDecode(s.tokens),packetBlocks);
 }
});
test('wrong differences, premature ends and invalid run lengths are rejected',()=>{
 const s=packetInitial();assert.throws(()=>packetExecute(s,'dc:0'));packetExecute(s,'dc:20');assert.throws(()=>packetExecute(s,'skip'));assert.throws(()=>packetExecute(s,'end'));assert.throws(()=>packetDecode([{kind:'dc',value:0},{kind:'ac',run:3,value:1}]));assert.throws(()=>packetDecode([{kind:'dc',value:0},{kind:'ac',run:0,value:0}]));assert.throws(()=>packetDecode([{kind:'dc',value:0}]));
});
test('saved operations replay, and the final reflection is required',()=>{
 const q=packetCreate();assert.throws(()=>packetVerify(q));for(const a of ['dc:20','emit','end','dc:0','end','dc:4','skip','skip','emit']){packetStep(q,a);assert.deepEqual(packetRestore(q),q);}q.answer='tokens';assert(!packetComplete(q));packetVerify(q);assert(packetComplete(q));assert.deepEqual(packetRestore(q),q);const bad=structuredClone(q);bad.history[0]='dc:4';assert.throws(()=>packetRestore(bad));
});
