import test from 'node:test';
import assert from 'node:assert/strict';
import {createUnification, createUnifyTrial, unifyApply, unifyFormat, unifyNext, unifyStep, unificationComplete, restoreUnification} from '../src/unification.js';

const paths = {ordinary:['split','bind','bind','success'], repeated:['split','bind','same','success'], clash:['split','bind','clash'], occurs:['occurs']};
test('finite unification applies substitutions, detects clashes and the occurs check', () => {
  const state = createUnification();
  for (const [id, actions] of Object.entries(paths)) {
    let trial = createUnifyTrial(id);
    for (const action of actions) {
      assert.equal(unifyNext(trial), action);
      const wrong = action === 'same' ? 'bind' : 'same';
      assert.deepEqual(unifyStep(trial, wrong).history, trial.history);
      trial = unifyStep(trial, action);
    }
    assert.equal(trial.status, ['clash','occurs'].includes(id) ? 'no-solution' : 'unified');
    state.trials[id] = trial;
  }
  assert.equal(unifyFormat(unifyApply(state.trials.ordinary.env.X,state.trials.ordinary.env)), 'ミラ');
  assert.equal(unifyFormat(unifyApply(state.trials.ordinary.env.Y,state.trials.ordinary.env)), '青');
  assert.equal(unifyFormat(unifyApply(state.trials.repeated.env.X,state.trials.repeated.env)), '太陽');
  assert.ok(unificationComplete(state));
});
test('saved histories replay and invalid histories are rejected', () => {
  const saved = {selected:'clash',histories:{ordinary:paths.ordinary,repeated:[],clash:['split','bind'],occurs:[]}};
  const restored = restoreUnification(saved);
  assert.equal(restored.selected,'clash');
  assert.equal(unifyNext(restored.trials.clash),'clash');
  assert.equal(restored.trials.ordinary.status,'unified');
  assert.throws(() => restoreUnification({...saved,histories:{...saved.histories,clash:['bind']}}));
  assert.throws(() => restoreUnification({...saved,selected:'missing'}));
});
