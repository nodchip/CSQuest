import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {towerGateQuestGroups} from '../src/tower-gate-quest-groups.js';
test('塔と関所の依頼には未開放分も含まれる',()=>{
 for(const [region,count] of [['sky',20],['mist',8]]){
  const groups=towerGateQuestGroups(region,[],false),all=groups.flatMap(g=>g.quests),local=groups.filter(g=>g.local).flatMap(g=>g.quests);
  assert.equal(all.length,count);assert.equal(new Set(all).size,count);
  assert.equal(towerGateQuestGroups(region,local,false).every(g=>g.complete),false);
  assert.ok(towerGateQuestGroups(region,all,true).every(g=>g.complete));
 }
});
test('各発展依頼は対応する二件の達成後に開く',()=>{
 for(const [region,id,needs] of [
 ['sky','tower-http-repair',['tower-http-request','tower-http-compare']],
 ['sky','tower-layers-route',['tower-layers-wrap','tower-layers-relay']],
 ['sky','tower-crypto-integrity',['tower-crypto-encrypt','tower-crypto-digest']],
 ['sky','tower-events-queue',['tower-events-register','tower-events-toggle']],
 ['sky','tower-window-retry',['tower-window-clean','tower-window-gap']],
 ['mist','gate-automata-both',['gate-automata-even','gate-automata-last']]]){
  const has=done=>towerGateQuestGroups(region,done,true).flatMap(g=>g.available).includes(id);
  assert.equal(has([needs[0]]),false,id);assert.equal(has(needs),true,id);
 }
});
