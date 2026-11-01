import test from 'node:test';
import assert from 'node:assert/strict';
import {bloomKeys,bloomBits,bloomMaybe,bloomStored,createBloom,bloomComplete,restoreBloom} from '../src/bloom-scroll.js';
import {createWordIndex,restoreWordIndex} from '../src/word-index.js';
test('two insertions light their union and preserve every inserted key',()=>{
 for(const inserted of [[],['moon'],['antidote'],bloomStored]){
  const expected=Array(6).fill(false);for(const id of inserted)for(const pos of bloomKeys[id].bits)expected[pos]=true;
  assert.deepEqual(bloomBits(inserted),expected);for(const id of inserted)assert.equal(bloomMaybe(inserted,id),true);
 }
 assert.equal(bloomMaybe(bloomStored,'herb'),true);assert.equal(bloomStored.includes('herb'),false);assert.equal(bloomMaybe(bloomStored,'fire'),false);
});
test('three checked predictions, valid drafts and migration are required',()=>{
 const old=createWordIndex();delete old.bloom;assert.equal(bloomComplete(restoreWordIndex(old).bloom),false);
 const s=createBloom();s.inserted=['moon','antidote'];s.answers={moon:'maybe',herb:'maybe',fire:'absent'};s.checked={moon:true,herb:true,fire:true};assert.equal(bloomComplete(s),true);
 const copy=restoreBloom(s);copy.answers.herb='absent';assert.equal(bloomComplete(copy),false);assert.equal(bloomComplete(s),true);
 assert.throws(()=>restoreBloom({...s,inserted:['moon','moon']}));assert.throws(()=>restoreBloom({...s,inserted:[]}));
});
