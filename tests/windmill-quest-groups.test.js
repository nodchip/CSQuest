import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {windmillQuestGroups} from '../src/windmill-quest-groups.js';

test('未開放の依頼が残ると地域全体は達成済みにならない', () => {
  const groups=windmillQuestGroups(['windmill-lamp','windmill-order','windmill-signals'],false);
  assert.equal(groups[0].complete,true);
  assert.equal(groups.reduce((sum,g)=>sum+g.remaining,0),0);
  assert.equal(groups.every(g=>g.complete),false);
});
test('前提の達成で追加の依頼が受けられる', () => {
  let groups=windmillQuestGroups([],true);
  assert.equal(groups[1].remaining,2);
  assert.equal(groups[2].remaining,2);
  assert.equal(groups[3].remaining,2);
  groups=windmillQuestGroups(['windmill-copies','windmill-pipeline','windmill-rle-encode','windmill-rle-decode','windmill-scatter-rising','windmill-scatter-falling'],true);
  assert.deepEqual(groups[1].available,['windmill-copies','windmill-pipeline','windmill-recovery']);
  assert.equal(groups[1].remaining,1);
  assert.equal(groups[2].remaining,1);
  assert.equal(groups[3].remaining,1);
});
test('全依頼を達成すると各分類が達成済みになる', () => {
  const all=windmillQuestGroups([],true).flatMap(g=>g.quests);
  assert.ok(windmillQuestGroups(all,true).every(g=>g.complete && g.remaining===0));
});

test('接頭符号の比較は基礎２件後に開き、未完了なら地域は未達成',()=>{const visible=done=>windmillQuestGroups(done,true).flatMap(g=>g.available);assert.equal(visible(['windmill-prefix-decode']).includes('windmill-prefix-compare'),false);assert.equal(visible(['windmill-prefix-decode','windmill-prefix-encode']).includes('windmill-prefix-compare'),true);const all=windmillQuestGroups([],true).flatMap(g=>g.quests);assert.equal(new Set(all).size,all.length);assert.equal(windmillQuestGroups(all.filter(id=>id!=='windmill-prefix-compare'),true).every(g=>g.complete),false);});

test('電力量の比較は基礎２件の達成後に開く',()=>{const visible=done=>windmillQuestGroups(done,true).flatMap(g=>g.available);assert.equal(visible(['windmill-energy-active']).includes('windmill-energy-compare'),false);assert.equal(visible(['windmill-energy-active','windmill-energy-idle']).includes('windmill-energy-compare'),true);const all=windmillQuestGroups([],true).flatMap(g=>g.quests);assert.equal(new Set(all).size,all.length);assert.equal(windmillQuestGroups(all.filter(id=>id!=='windmill-energy-compare'),true).every(g=>g.complete),false);});
