import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {riverQuestGroups} from '../src/river-quest-groups.js';
test('村の依頼は未開放を含む八件で達成を判定する',()=>{
 const groups=riverQuestGroups([],false),all=groups.flatMap(g=>g.quests);
 assert.equal(all.length,8);assert.equal(new Set(all).size,8);
 assert.equal(riverQuestGroups(groups[0].quests,false).every(g=>g.complete),false);
 assert.ok(riverQuestGroups(all,true).every(g=>g.complete));
});
test('水門と数札の続きはそれぞれ二件の後に開く',()=>{
 for(const [id,needs] of [['river-type-branch',['river-type-tools','river-type-record']],['river-functional-pipeline',['river-functional-map','river-functional-fold']]]){
  const available=done=>riverQuestGroups(done,true).flatMap(g=>g.available).includes(id);
  assert.equal(available([needs[0]]),false,id);assert.equal(available(needs),true,id);
 }
});
