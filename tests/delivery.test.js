import test from 'node:test';
import assert from 'node:assert/strict';
import {createDelivery,transmit,fragments} from '../src/delivery.js';

test('lost data and lost acknowledgement both require retry without duplicates', () => {
  let state=createDelivery();
  state=transmit(state,'send');
  assert.equal(state.phase,'waiting'); assert.deepEqual(state.received,[]);
  state=transmit(state,'retry');
  assert.equal(state.current,1); assert.deepEqual(state.received,[0]);
  state=transmit(state,'send');
  assert.equal(state.phase,'waiting'); assert.deepEqual(state.received,[0,1]);
  state=transmit(state,'retry');
  assert.equal(state.current,2); assert.deepEqual(state.received,[0,1]);
  assert.match(state.log.at(-1).detail,/重複/);
  state=transmit(state,'send');
  assert.equal(state.phase,'done');
  assert.deepEqual(state.received.map(i=>fragments[i]),fragments);
  assert.deepEqual(state.attempts,[2,2,1]);
});

test('sender cannot advance before acknowledgement or retry before a timeout', () => {
  const initial=createDelivery();
  assert.throws(()=>transmit(initial,'retry'),RangeError);
  const waiting=transmit(initial,'send');
  assert.throws(()=>transmit(waiting,'send'),RangeError);
  assert.deepEqual(initial.received,[]);
});
