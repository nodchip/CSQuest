import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {cityQuestGroups} from '../src/city-quest-groups.js';
test('街の既存依頼と未開放の依頼を合わせて達成を判定する',()=>{
 const groups=cityQuestGroups([],false),all=groups.flatMap(g=>g.quests);
 assert.deepEqual(all,['city-sort','city-queue','city-sorting-insertion','city-sorting-selection','city-sorting-compare']);
 assert.equal(cityQuestGroups(groups[0].quests,false).every(g=>g.complete),false);
 assert.ok(cityQuestGroups(all,true).every(g=>g.complete));
});
test('比較の相談は二つの並べ方を試した後に開く',()=>{
 const has=done=>cityQuestGroups(done,true).flatMap(g=>g.available).includes('city-sorting-compare');
 assert.equal(has(['city-sorting-insertion']),false);assert.equal(has(['city-sorting-insertion','city-sorting-selection']),true);
});
