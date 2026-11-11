import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {cityQuestGroups} from '../src/city-quest-groups.js';
test('街の既存依頼と未開放の依頼を合わせて達成を判定する',()=>{
 const groups=cityQuestGroups([],false),all=groups.flatMap(g=>g.quests);
 assert.deepEqual(all,['city-sort','city-queue','city-depflow-line','city-depflow-branch','city-depflow-cycle','city-coinplan-greedy','city-coinplan-table','city-coinplan-compare','city-radixparcel-ones','city-radixparcel-full','city-radixparcel-stable','city-mergeruns-first','city-mergeruns-second','city-mergeruns-compare','city-sorting-insertion','city-sorting-selection','city-sorting-compare']);
 assert.equal(cityQuestGroups(groups[0].quests,false).every(g=>g.complete),false);
 assert.ok(cityQuestGroups(all,true).every(g=>g.complete));
});
test('比較の相談は二つの並べ方を試した後に開く',()=>{
 const has=done=>cityQuestGroups(done,true).flatMap(g=>g.available).includes('city-sorting-compare');
 assert.equal(has(['city-sorting-insertion']),false);assert.equal(has(['city-sorting-insertion','city-sorting-selection']),true);
});

test('循環の相談は別々の２準備の後に開く',()=>{const has=done=>cityQuestGroups(done,true).flatMap(g=>g.available).includes('city-depflow-cycle');assert.equal(has(['city-depflow-line']),false);assert.equal(has(['city-depflow-line','city-depflow-branch']),true);});

test('併合の比較は二つの依頼後に開く',()=>{const has=done=>cityQuestGroups(done,true).flatMap(g=>g.available).includes('city-mergeruns-compare');assert.equal(has(['city-mergeruns-first']),false);assert.equal(has(['city-mergeruns-first','city-mergeruns-second']),true);});

test('同じ番号の順は基礎二件の後に開く',()=>{const has=done=>cityQuestGroups(done,true).flatMap(g=>g.available).includes('city-radixparcel-stable');assert.equal(has(['city-radixparcel-ones']),false);assert.equal(has(['city-radixparcel-ones','city-radixparcel-full']),true);});

test('品札の比較は基礎二件の後に開く',()=>{const has=done=>cityQuestGroups(done,true).flatMap(g=>g.available).includes('city-coinplan-compare');assert.equal(has(['city-coinplan-greedy']),false);assert.equal(has(['city-coinplan-greedy','city-coinplan-table']),true);});
