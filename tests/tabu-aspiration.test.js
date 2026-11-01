import test from 'node:test';
import assert from 'node:assert/strict';
import {createAspiration, aspirationAct, aspirationComplete, restoreAspiration} from '../src/tabu-aspiration.js';

test('the two policies and three boundary cases require the correct decision', () => {
  let state = createAspiration();
  for (const [mode, situation, correct] of [
    ['strict', 'better', 'retain'], ['strict', 'equal', 'retain'], ['strict', 'lower', 'retain'],
    ['aspire', 'better', 'override'], ['aspire', 'equal', 'retain'], ['aspire', 'lower', 'retain']
  ]) {
    for (const action of [`mode:${mode}`, `case:${situation}`]) state = aspirationAct(state, action).state;
    const wrong = correct === 'retain' ? 'override' : 'retain';
    assert.equal(aspirationAct(state, `choose:${wrong}`).ok, false);
    state = aspirationAct(state, `choose:${correct}`).state;
    assert.deepEqual(restoreAspiration(state), state);
  }
  assert.equal(state.seen.length, 6);
  assert.equal(aspirationComplete(state), true);
  assert.throws(() => restoreAspiration({history: ['mode:aspire', 'choose:retain']}));
});
