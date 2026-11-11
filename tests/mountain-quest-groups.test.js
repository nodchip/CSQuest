import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {mountainQuestGroups} from '../src/mountain-quest-groups.js';
test('山道の三つが達成されるまで次の依頼は開かず全達成にもならない',()=>{
 const groups=mountainQuestGroups(['mountain-connect','mountain-hops']);
 assert.equal(groups[0].remaining,1);assert.equal(groups[1].available.length,0);assert.equal(groups.every(g=>g.complete),false);
});
test('山道の三つの達成で道の調べ方が開き全依頼の達成を判定できる',()=>{
 let groups=mountainQuestGroups(['mountain-connect','mountain-hops','mountain-time']);
 assert.equal(groups[3].remaining,3);assert.equal(groups[3].complete,false);
 groups=mountainQuestGroups(groups.flatMap(g=>g.quests));assert.ok(groups.every(g=>g.complete));
});

test('見積もりの相談は区切り後に開き、発展には基礎２件が必要',()=>{const has=(done,ready)=>mountainQuestGroups(done,ready).flatMap(g=>g.available);assert.equal(has([],false).includes('mountain-astar-uniform'),false);assert.equal(has([],true).includes('mountain-astar-uniform'),true);assert.equal(has(['mountain-astar-uniform'],true).includes('mountain-astar-compare'),false);assert.equal(has(['mountain-astar-uniform','mountain-astar-astar'],true).includes('mountain-astar-compare'),true);});

test('山の分類は旧依頼と新依頼を重複なく保持する',()=>{const groups=mountainQuestGroups([],true),ids=groups.flatMap(g=>g.quests);assert.equal(ids.length,15);assert.equal(new Set(ids).size,15);for(const id of ['mountain-connect','mountain-hops','mountain-time','search-bfs','search-weighted','search-compare','mountain-astar-uniform','mountain-astar-astar','mountain-astar-compare'])assert.ok(ids.includes(id),id);});

test('全域木の比較は祭り後、基礎２件の達成後に開く',()=>{const has=(done,endgame)=>mountainQuestGroups(done,endgame).flatMap(g=>g.available);assert.equal(has([],false).includes('mountain-primroads-forest'),false);assert.equal(has([],true).includes('mountain-primroads-forest'),true);assert.equal(has(['mountain-primroads-forest'],true).includes('mountain-primroads-compare'),false);assert.equal(has(['mountain-primroads-forest','mountain-primroads-ties'],true).includes('mountain-primroads-compare'),true);});

test('綱の発展は基礎二件の後に開く',()=>{const has=(done,ready)=>mountainQuestGroups(done,ready).flatMap(g=>g.available);assert.equal(has([],false).includes('mountain-ropegcd-first'),false);assert.equal(has(['mountain-ropegcd-first'],true).includes('mountain-ropegcd-third'),false);assert.equal(has(['mountain-ropegcd-first','mountain-ropegcd-second'],true).includes('mountain-ropegcd-third'),true);});
