import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {forgeStationQuestGroups} from '../src/forge-station-quest-groups.js';
test('鍛冶街と駅の依頼は重複せず未開放も全達成の判定に含める',()=>{
 for(const [region,count] of [['forge',57],['station',30]]){
  const groups=forgeStationQuestGroups(region,[],false),all=groups.flatMap(g=>g.quests);
  assert.equal(all.length,count);assert.equal(new Set(all).size,count);
  const local=groups.filter(g=>g.local).flatMap(g=>g.quests);
  assert.equal(forgeStationQuestGroups(region,local,false).every(g=>g.complete),false);
  assert.ok(forgeStationQuestGroups(region,all,true).every(g=>g.complete));
 }
});
test('追加の相談は対応する二件を終えてから開く',()=>{
 for(const [region,id,needs] of [
  ['forge','forge-flashshelves-combined',['forge-flashshelves-update','forge-flashshelves-collect']],
  ['forge','forge-forktales-life',['forge-forktales-private','forge-forktales-offset']],
  ['forge','forge-dmagems-compare',['forge-dmagems-cpu','forge-dmagems-dma']],
  ['forge','forge-lampneg-counter',['forge-lampneg-and','forge-lampneg-or']],
  ['forge','forge-carrysigns-compare',['forge-carrysigns-signed','forge-carrysigns-unsigned']],
  ['forge','forge-cacheways-compare',['forge-cacheways-direct','forge-cacheways-two']],
  ['forge','forge-sharingshelves-compare',['forge-sharingshelves-packed','forge-sharingshelves-separate']],
  ['forge','forge-instructionhazard-forward',['forge-instructionhazard-unsafe','forge-instructionhazard-stall']],
  ['forge','forge-signedlamps-limit',['forge-signedlamps-minus','forge-signedlamps-zero']],
  ['forge','forge-writepolicy-compare',['forge-writepolicy-through','forge-writepolicy-back']],
  ['forge','forge-cache-mapping',['forge-cache-temporal','forge-cache-spatial']],
  ['forge','forge-cpu-data',['forge-cpu-basic','forge-cpu-branch']],
  ['forge','forge-switch-compare',['forge-switch-raw','forge-switch-filter']],
  ['forge','forge-io-compare',['forge-io-poll','forge-io-interrupt']],
  ['forge','forge-objects-interaction',['forge-objects-identity','forge-objects-encapsulation']],
  ['forge','forge-roundstone-compare',['forge-roundstone-even','forge-roundstone-odd']],
  ['forge','forge-integer-addition',['forge-integer-unsigned','forge-integer-reading']],
  ['station','station-tlbjourney-tagged',['station-tlbjourney-unsafe','station-tlbjourney-flush']],
  ['station','station-ringparcel-compare',['station-ringparcel-wrap','station-ringparcel-full']],
  ['station','station-heap-remove',['station-heap-queue','station-heap-insert']],
  ['station','station-cowpages-compare',['station-cowpages-shared','station-cowpages-cow']],
  ['station','station-spacefit-compare',['station-spacefit-first','station-spacefit-best']],
  ['station','station-agingwork-compare',['station-agingwork-fixed','station-agingwork-aging']],
  ['station','station-replacement-compare',['station-replacement-fifo','station-replacement-lru']],
  ['station','station-os-access',['station-os-queue','station-os-storage']]]){
  const available=done=>forgeStationQuestGroups(region,done,true).flatMap(g=>g.available).includes(id);
  assert.equal(available([needs[0]]),false,id);assert.equal(available(needs),true,id);
 }
});
