import test from 'node:test';
import assert from 'node:assert/strict';
import {utfCases,bytePalette,utfInfo,utfCorrect,createUtf,restoreUtf,utfComplete} from '../src/utf8.js';

test('known UTF-8 sequences and scalar values match independent reference values',()=>{
  const expected={ascii:{points:['U+0041'],bytes:['41']},kana:{points:['U+3042'],bytes:['E3','81','82']},composed:{points:['U+00E9'],bytes:['C3','A9']},decomposed:{points:['U+0065','U+0301'],bytes:['65','CC','81']},emoji:{points:['U+1F600'],bytes:['F0','9F','98','80']}};
  for(const [id,item] of Object.entries(expected)){const result=utfInfo(id);assert.deepEqual(result.points,item.points);assert.deepEqual(result.bytes,item.bytes);assert.ok(result.bytes.every(byte=>bytePalette.includes(byte)));assert.equal(utfCorrect(id,{points:item.points.length,bytes:item.bytes}),true);}
  assert.equal(utfCases.decomposed.text.normalize('NFC'),utfCases.composed.text);assert.notDeepEqual(utfInfo('decomposed').bytes,utfInfo('composed').bytes);
});
test('each byte position and point count affects correctness',()=>{
  for(const id of Object.keys(utfCases)){const info=utfInfo(id);assert.equal(utfCorrect(id,{points:info.points.length+1,bytes:info.bytes}),false);for(let i=0;i<info.bytes.length;i++){const wrong=info.bytes.slice();wrong[i]=wrong[i]==='41'?'65':'41';assert.equal(utfCorrect(id,{points:info.points.length,bytes:wrong}),false);}}
});
test('completion requires checked cases and restored bytes are copied',()=>{
  const state=createUtf();for(const id of Object.keys(utfCases)){const info=utfInfo(id);state.choices[id]={points:info.points.length,bytes:info.bytes,checked:true};}assert.equal(utfComplete(state),true);
  const copy=restoreUtf(state);state.choices.ascii.bytes[0]='65';assert.equal(utfComplete(state),false);assert.equal(utfComplete(copy),true);state.choices.ascii.bytes=['XX'];assert.throws(()=>restoreUtf(state),RangeError);
});
