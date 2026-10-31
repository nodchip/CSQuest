import test from 'node:test';
import assert from 'node:assert/strict';
import { villages, orders, joinOrders, evaluateMatches } from '../src/join.js';

test('matching identifiers produce one row per matched order and omit unmatched rows', () => {
  const joined=joinOrders(orders,villages);
  assert.deepEqual(joined.map(row=>[row.orderId,row.village]),[['O1','東の村'],['O2','西の村'],['O3','東の村']]);
  assert.equal(joined.filter(row=>row.villageId==='V1').length,2);
  assert.equal(joined.some(row=>row.orderId==='O4'),false);
});
test('correct choices include explicitly marking an unmatched order', () => {
  const choices={O1:'V1',O2:'V2',O3:'V1',O4:'none'};
  assert.ok(evaluateMatches(choices).every(row=>row.correct));
  assert.equal(evaluateMatches({...choices,O4:'V3'}).at(-1).correct,false);
  assert.equal(evaluateMatches({...choices,O4:''}).at(-1).correct,false);
});
test('equijoin returns every match when the right side has duplicate keys', () => {
  const joined=joinOrders([{id:'X',item:'薬草',villageId:'V1'}],[{id:'V1',name:'村A'},{id:'V1',name:'村B'}]);
  assert.deepEqual(joined.map(row=>row.village),['村A','村B']);
});
