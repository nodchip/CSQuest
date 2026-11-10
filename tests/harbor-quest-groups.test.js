import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {harborQuestGroups} from '../src/harbor-quest-groups.js';
test('港の20件は重複せず未開放の依頼を含めて達成判定する',()=>{
 const groups=harborQuestGroups([],false),all=groups.flatMap(g=>g.quests);
 assert.equal(all.length,20);assert.equal(new Set(all).size,20);
 assert.equal(harborQuestGroups(groups[0].quests,false).every(g=>g.complete),false);
 assert.ok(harborQuestGroups(all,true).every(g=>g.complete));
});
test('港の発展依頼は対応する二件を終えると開く',()=>{
 for(const [id,needs] of [
 ['harbor-counting-pigeon',['harbor-counting-gear','harbor-counting-roles']],
 ['harbor-deadlock-fairness',['harbor-deadlock-cycle','harbor-deadlock-order']],
 ['harbor-performance-overhead',['harbor-performance-serial','harbor-performance-parallel']],
 ['harbor-lock',['harbor-count','harbor-join']],
 ['harbor-condition-recheck',['harbor-condition-wait','harbor-condition-notify']],
 ['harbor-parallel-pipeline',['harbor-parallel-map','harbor-parallel-reduce']]]){
 const available=done=>harborQuestGroups(done,true).flatMap(g=>g.available).includes(id);
 assert.equal(available([needs[0]]),false,id);assert.equal(available(needs),true,id);}
});
