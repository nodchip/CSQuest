import test from 'node:test';
import assert from 'node:assert/strict';
import { createBattle, lightsForTurn, takeTurn, MAX_TURNS } from '../src/battle.js';

test('a successful strategy observes the four light patterns', () => {
  let battle = createBattle();
  for (const action of ['guard','attack','guard','attack']) battle = takeTurn(battle, action);
  assert.equal(battle.status, 'won');
  assert.equal(battle.playerHealth, 2);
  assert.equal(battle.guardianHealth, 0);
  assert.deepEqual(battle.history.map(h => [h.a,h.b]), [[0,0],[0,1],[1,1],[1,0]]);
});
test('attacking when both lights are equal costs health, guarding does not', () => {
  const initial = createBattle();
  const wrong = takeTurn(initial, 'attack');
  assert.equal(wrong.playerHealth, 1);
  assert.equal(initial.playerHealth, 2);
  assert.equal(takeTurn(initial, 'guard').playerHealth, 2);
  assert.deepEqual(lightsForTurn(4), [0,0]);
});
test('waiting too long or losing health ends the battle', () => {
  let battle = createBattle();
  for (let i=0;i<MAX_TURNS;i++) battle=takeTurn(battle,'guard');
  assert.equal(battle.status, 'lost');
  assert.throws(()=>takeTurn(battle,'attack'));
  let second = takeTurn(createBattle(),'attack');
  second = takeTurn(second,'guard');
  second = takeTurn(second,'attack');
  assert.equal(second.status,'lost');
});
