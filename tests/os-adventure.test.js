import test from 'node:test';
import assert from 'node:assert/strict';
import {createOsAdventure, osAdventureAct, restoreOsAdventure} from '../src/os-adventure.js';

function act(state, action) {
  const result = osAdventureAct(state, action);
  assert.equal(result.ok, true, `${action}: ${result.message}`);
  return result.state;
}
function readyAtDesk() {
  let state = createOsAdventure();
  for (const action of ['move:clock', 'timer:disable', 'timer:tick', 'timer:tick', 'timer:dispatch', 'timer:tick', 'move:desk']) state = act(state, action);
  return state;
}
function authorize(state) {
  for (const action of ['mode:guarded', 'test:own', 'test:other', 'audit']) state = act(state, action);
  return state;
}

test('OS adventure requires a working timer, access checks and a device driver', () => {
  let state = act(createOsAdventure(), 'move:desk');
  assert.equal(osAdventureAct(state, 'test:own').ok, false);
  assert.equal(osAdventureAct(state, 'move:machine').ok, false);
  state = readyAtDesk();
  assert.equal(state.ready, true);
  for (const action of ['test:own', 'test:other', 'audit']) state = act(state, action);
  assert.equal(state.audit.other.leak, true);
  assert.equal(state.authorized, false);
  assert.equal(osAdventureAct(state, 'move:machine').ok, false);
  state = authorize(state);
  assert.equal(state.authorized, true);
  state = act(state, 'move:machine');
  assert.equal(osAdventureAct(state, 'device:install').ok, false);
  state = act(state, 'device:try');
  assert.equal(state.missingSeen, true);
  assert.equal(state.lit, false);
  state = act(state, 'device:install');
  state = act(state, 'device:try');
  assert.equal(state.lit, true);
  state = act(state, 'move:beacon');
  assert.equal(state.status, 'won');
  assert.deepEqual(restoreOsAdventure(JSON.parse(JSON.stringify(state))), state);
});

test('changing access policy invalidates the audit and the light', () => {
  let state = authorize(readyAtDesk());
  for (const action of ['move:machine', 'device:try', 'device:install', 'device:try', 'move:desk', 'mode:broad']) state = act(state, action);
  assert.equal(state.authorized, false);
  assert.equal(state.lit, false);
  assert.deepEqual(state.audit, {own: null, other: null});
  assert.equal(osAdventureAct(state, 'move:machine').ok, false);
});

test('invalid moves and forged or oversized histories are rejected', () => {
  const state = createOsAdventure();
  assert.equal(osAdventureAct(state, 'move:machine').ok, false);
  assert.equal(osAdventureAct(state, 'timer:tick').ok, false);
  assert.throws(() => restoreOsAdventure({history: ['move:beacon']}), RangeError);
  assert.throws(() => restoreOsAdventure({history: Array(101).fill('move:clock')}), RangeError);
});
