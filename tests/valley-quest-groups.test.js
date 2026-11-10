import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {valleyQuestGroups} from '../src/valley-quest-groups.js';
test('未開放を含む13件の達成と現在受けられる件数を分ける',()=>{
 const local=['data-record','data-filter','data-join','valley-records'];
 const groups=valleyQuestGroups(local,false);
 assert.equal(groups.flatMap(g=>g.quests).length,13);assert.equal(groups.reduce((n,g)=>n+g.remaining,0),0);assert.equal(groups.every(g=>g.complete),false);
 assert.ok(valleyQuestGroups(groups.flatMap(g=>g.quests),true).every(g=>g.complete));
});
test('各追加依頼は対応する二件を終えてから開く',()=>{
 for(const [id,inputs] of Object.entries({'valley-integrity-lab':['valley-query-lab','valley-tables-lab'],'valley-modeling-lookup':['valley-modeling-one','valley-modeling-many'],'valley-transaction-isolation':['valley-transaction-commit','valley-transaction-rollback']})){
  const available=done=>valleyQuestGroups(done,true).flatMap(g=>g.available).includes(id);
  assert.equal(available([inputs[0]]),false,id);assert.equal(available(inputs),true,id);
 }
});
