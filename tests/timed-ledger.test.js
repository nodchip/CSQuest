import test from 'node:test';
import assert from 'node:assert/strict';
import {timedOrders,timedLate,timedAggregate,timedReplay,timedCreate,timedRestore,timedDone} from '../src/timed-ledger.js';
const query=(mode,guess)=>({type:'query',mode,guess}),insert={type:'insert'},refresh={type:'refresh'};
const history=[query('exact',0),query('raw',5),query('view',5),insert,query('raw',6),query('view',5),refresh,query('view',6)];
test('exact and latest-prior joins, half-open windows and late arrival are computed correctly',()=>{
 const exact=timedAggregate(timedOrders,'exact');assert.deepEqual(exact.buckets,[{qty:0,revenue:0},{qty:0,revenue:0}]);assert.ok(exact.rows.every(x=>x.price===null));
 assert.deepEqual(timedAggregate(timedOrders,'asof').buckets,[{qty:5,revenue:10},{qty:4,revenue:12}]);assert.deepEqual(timedAggregate([...timedOrders,timedLate],'asof').buckets,[{qty:6,revenue:12},{qty:4,revenue:12}]);
 const boundary=timedAggregate([{id:'edge',time:3,qty:2}],'asof');assert.deepEqual(boundary.buckets,[{qty:0,revenue:0},{qty:2,revenue:6}]);
});
test('view remains stale until refresh and operation history is validated',()=>{
 const state=timedReplay(history);assert.equal(state.seen.length,6);assert.deepEqual(state.cache,[{qty:6,revenue:12},{qty:4,revenue:12}]);assert.throws(()=>timedReplay([insert]));assert.throws(()=>timedReplay([query('raw',6)]));assert.throws(()=>timedReplay([...history,refresh]));
 const q=timedCreate();q.events=history;q.reflection='stale';assert.equal(timedDone(q),true);const copy=timedRestore(q);copy.events[0].guess=5;assert.equal(q.events[0].guess,0);
});
