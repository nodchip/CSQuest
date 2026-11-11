import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {towerGateQuestGroups} from '../src/tower-gate-quest-groups.js';
test('塔と関所の依頼には未開放分も含まれる',()=>{
 for(const [region,count] of [['sky',47],['mist',23]]){
  const groups=towerGateQuestGroups(region,[],false),all=groups.flatMap(g=>g.quests),local=groups.filter(g=>g.local).flatMap(g=>g.quests);
  assert.equal(all.length,count);assert.equal(new Set(all).size,count);
  assert.equal(towerGateQuestGroups(region,local,false).every(g=>g.complete),false);
  assert.ok(towerGateQuestGroups(region,all,true).every(g=>g.complete));
 }
});
test('各発展依頼は対応する二件の達成後に開く',()=>{
 for(const [region,id,needs] of [
 ['mist','gate-availability-shared',['gate-availability-single','gate-availability-distributed']],
 ['sky','tower-ipv4pieces-offset',['tower-ipv4pieces-capacity','tower-ipv4pieces-parts']],
 ['sky','tower-handshaketowers-compare',['tower-handshaketowers-first','tower-handshaketowers-second']],
 ['sky','tower-http-repair',['tower-http-request','tower-http-compare']],
 ['sky','tower-layers-route',['tower-layers-wrap','tower-layers-relay']],
 ['sky','tower-crypto-integrity',['tower-crypto-encrypt','tower-crypto-digest']],
 ['sky','tower-events-queue',['tower-events-register','tower-events-toggle']],
 ['sky','tower-adjroute-compare',['tower-adjroute-list','tower-adjroute-matrix']],
 ['sky','tower-retryeffect-key',['tower-retryeffect-set','tower-retryeffect-increment']],
 ['sky','tower-paritylantern-double',['tower-paritylantern-make','tower-paritylantern-single']],
 ['sky','tower-etagmap-compare',['tower-etagmap-unchanged','tower-etagmap-changed']],
 ['sky','tower-dnsexpiry-compare',['tower-dnsexpiry-short','tower-dnsexpiry-long']],
 ['sky','tower-routeprefix-compare',['tower-routeprefix-specific','tower-routeprefix-fallback']],
 ['sky','tower-congestion-recover',['tower-congestion-grow','tower-congestion-loss']],
 ['sky','tower-window-retry',['tower-window-clean','tower-window-gap']],
 ['mist','gate-automata-both',['gate-automata-even','gate-automata-last']],
 ['mist','gate-nfagate-reject',['gate-nfagate-one','gate-nfagate-accept']],
 ['mist','gate-gatetests-both',['gate-gatetests-outcomes','gate-gatetests-lower']],
 ['mist','gate-sealsig-identity',['gate-sealsig-integrity','gate-sealsig-keys']],
 ['mist','gate-injection-choose',['gate-injection-concat','gate-injection-bound']]]){
  const has=done=>towerGateQuestGroups(region,done,true).flatMap(g=>g.available).includes(id);
  assert.equal(has([needs[0]]),false,id);assert.equal(has(needs),true,id);
 }
});
