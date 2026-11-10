import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {workshopQuestGroups} from '../src/workshop-quest-groups.js';
test('工房の初回依頼を実行済み状態から数え、未開放を達成扱いにしない',()=>{
 const groups=workshopQuestGroups(['forest','branch','loop','workshop-steps'],false,true),all=groups.flatMap(g=>g.quests);
 assert.equal(all.length,18);assert.equal(new Set(all).size,18);assert.equal(groups[0].complete,true);assert.equal(groups.every(g=>g.complete),false);
 assert.ok(workshopQuestGroups(all.filter(x=>x!=='workshop-opening'),true,true).every(g=>g.complete));
 assert.equal(workshopQuestGroups(all.filter(x=>x!=='workshop-opening'),true,false)[0].complete,false);
});
test('発展依頼はそれぞれ二件の達成後に開く',()=>{
 for(const [id,needs] of [
 ['workshop-recursion-repair',['workshop-recursion-sum','workshop-recursion-tree']],
 ['workshop-invariant-compare',['workshop-invariant-trace','workshop-invariant-proof']],
 ['workshop-debug-repair',['workshop-debug-trace','workshop-debug-breakpoint']],
 ['workshop-refactor-migration',['workshop-refactor-structure','workshop-refactor-interface']]]){
 const has=done=>workshopQuestGroups(done,true,true).flatMap(g=>g.available).includes(id);
 assert.equal(has([needs[0]]),false,id);assert.equal(has(needs),true,id);}
});
