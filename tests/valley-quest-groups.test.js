import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {valleyQuestGroups} from '../src/valley-quest-groups.js';
test('未開放を含む40件の達成と現在受けられる件数を分ける',()=>{
 const local=['data-record','data-filter','data-join','valley-records'];
 const groups=valleyQuestGroups(local,false);
 assert.equal(groups.flatMap(g=>g.quests).length,40);assert.equal(groups.reduce((n,g)=>n+g.remaining,0),0);assert.equal(groups.every(g=>g.complete),false);
 assert.ok(valleyQuestGroups(groups.flatMap(g=>g.quests),true).every(g=>g.complete));
});
test('各追加依頼は対応する二件を終えてから開く',()=>{
 for(const [id,inputs] of Object.entries({'valley-shardjourney-compare':['valley-shardjourney-parity','valley-shardjourney-range'],'valley-replicajourney-compare':['valley-replicajourney-stale','valley-replicajourney-delivery'],'valley-rowbalance-same':['valley-rowbalance-one','valley-rowbalance-clash'],'valley-leftjoin-where':['valley-leftjoin-all','valley-leftjoin-on'],'valley-groupledger-compare':['valley-groupledger-count','valley-groupledger-sum'],'valley-sqlnull-compound':['valley-sqlnull-equal','valley-sqlnull-missing'],'valley-integrity-lab':['valley-query-lab','valley-tables-lab'],'valley-modeling-lookup':['valley-modeling-one','valley-modeling-many'],'valley-transaction-isolation':['valley-transaction-commit','valley-transaction-rollback'],'valley-query-compose':['valley-query-join','valley-query-select'],'valley-ledgersplit-name':['valley-ledgersplit-update','valley-ledgersplit-village'],'valley-journal-decide':['valley-journal-undo','valley-journal-redo']})){
  const available=done=>valleyQuestGroups(done,true).flatMap(g=>g.available).includes(id);
  assert.equal(available([inputs[0]]),false,id);assert.equal(available(inputs),true,id);
 }
});
