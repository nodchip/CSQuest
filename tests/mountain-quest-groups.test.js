import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {mountainQuestGroups} from '../src/mountain-quest-groups.js';
test('山道の三つが達成されるまで次の依頼は開かず全達成にもならない',()=>{
 const groups=mountainQuestGroups(['mountain-connect','mountain-hops']);
 assert.equal(groups[0].remaining,1);assert.equal(groups[1].available.length,0);assert.equal(groups.every(g=>g.complete),false);
});
test('山道の三つの達成で道の調べ方が開き全六件達成を判定できる',()=>{
 let groups=mountainQuestGroups(['mountain-connect','mountain-hops','mountain-time']);
 assert.equal(groups[1].remaining,3);assert.equal(groups[1].complete,false);
 groups=mountainQuestGroups(groups.flatMap(g=>g.quests));assert.ok(groups.every(g=>g.complete));
});
