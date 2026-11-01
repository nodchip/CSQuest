import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCompleted,mergeCompleted} from '../src/progress-record.js';
test('既知の達成と未対応の達成を分け、重複を除き、どちらも保持する',()=>{
  assert.deepEqual(parseCompleted(null,['a']),{completed:[],unknown:[]});
  assert.deepEqual(parseCompleted('["a","future","a","future"]',['a']),{completed:['a'],unknown:['future']});
});
test('壊れた JSON や配列以外の記録を空の進捗として扱わない',()=>{
  for(const raw of ['{broken','', 'null', '{}', '["a",3]'])assert.throws(()=>parseCompleted(raw,['a']));
});
test('別のタブの達成と未知の ID を重複なく統合する',()=>{
  const first=parseCompleted('["a","future"]',['a','b']);
  const second=parseCompleted('["b","future","new"]',['a','b']);
  assert.deepEqual(mergeCompleted(first,second),{completed:['a','b'],unknown:['future','new']});
  assert.deepEqual(first,{completed:['a'],unknown:['future']});
});
