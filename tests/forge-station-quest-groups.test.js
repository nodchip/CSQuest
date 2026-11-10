import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {forgeStationQuestGroups} from '../src/forge-station-quest-groups.js';
test('鍛冶街と駅の依頼は重複せず未開放も全達成の判定に含める',()=>{
 for(const [region,count] of [['forge',30],['station',15]]){
  const groups=forgeStationQuestGroups(region,[],false),all=groups.flatMap(g=>g.quests);
  assert.equal(all.length,count);assert.equal(new Set(all).size,count);
  const local=groups.filter(g=>g.local).flatMap(g=>g.quests);
  assert.equal(forgeStationQuestGroups(region,local,false).every(g=>g.complete),false);
  assert.ok(forgeStationQuestGroups(region,all,true).every(g=>g.complete));
 }
});
test('追加の相談は対応する二件を終えてから開く',()=>{
 for(const [region,id,needs] of [
  ['forge','forge-writepolicy-compare',['forge-writepolicy-through','forge-writepolicy-back']],
  ['forge','forge-cache-mapping',['forge-cache-temporal','forge-cache-spatial']],
  ['forge','forge-cpu-data',['forge-cpu-basic','forge-cpu-branch']],
  ['forge','forge-switch-compare',['forge-switch-raw','forge-switch-filter']],
  ['forge','forge-io-compare',['forge-io-poll','forge-io-interrupt']],
  ['forge','forge-objects-interaction',['forge-objects-identity','forge-objects-encapsulation']],
  ['forge','forge-roundstone-compare',['forge-roundstone-even','forge-roundstone-odd']],
  ['forge','forge-integer-addition',['forge-integer-unsigned','forge-integer-reading']],
  ['station','station-heap-remove',['station-heap-queue','station-heap-insert']],
  ['station','station-replacement-compare',['station-replacement-fifo','station-replacement-lru']],
  ['station','station-os-access',['station-os-queue','station-os-storage']]]){
  const available=done=>forgeStationQuestGroups(region,done,true).flatMap(g=>g.available).includes(id);
  assert.equal(available([needs[0]]),false,id);assert.equal(available(needs),true,id);
 }
});
