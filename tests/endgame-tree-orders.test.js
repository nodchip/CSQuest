import test from 'node:test';import assert from 'node:assert/strict';import {replayTreeOrders} from '../src/endgame-tree-orders.js';
const steps=letters=>letters.split('').map(x=>`visit:${x}`);
test('three traversals of the branch tree have independently expected orders',()=>{
 for(const [mode,expected] of [['pre','ABDECF'],['in','DBEACF'],['post','DEBFCA']]){const p=replayTreeOrders(mode,steps(expected));assert.deepEqual(p.visited,expected.split(''));assert.equal(p.done,true);}
});
test('wrong, duplicate, out of order and post completion operations fail; reset restores start',()=>{
 for(const [k,h] of [['pre',['visit:B']],['in',['visit:B']],['post',['visit:D','visit:D']],['pre',[...steps('ABDECF'),'reset']],['pre',['visit:G']]])assert.equal(replayTreeOrders(k,h),null);
 assert.deepEqual(replayTreeOrders('pre',['visit:A','reset']).visited,[]);assert.equal(replayTreeOrders('other',[]),null);
});
