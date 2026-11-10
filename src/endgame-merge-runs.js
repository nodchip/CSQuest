import { createMerge, chooseMerge } from './merge-sort.js';

// The saved history contains only operations available on the current screen.
export function replayMergeRuns(kind, history) {
  if (!['first', 'second', 'compare'].includes(kind) || !Array.isArray(history) || history.length > 60) return null;
  const modes = kind === 'compare' ? ['first', 'second'] : [kind];
  let scene = 0, state = createMerge(modes[0]), done = false;
  const results = [];
  for (const action of history) {
    if (typeof action !== 'string' || done) return null;
    if (scene === modes.length) {
      if (kind !== 'compare' || action !== 'answer:stable') return null;
      done = true;
      continue;
    }
    if (action === 'reset') {
      if (state.done) return null;
      state = createMerge(modes[scene]);
      continue;
    }
    if (action === 'next') {
      if (!state.done) return null;
      results.push({ mode: modes[scene], items: state.runs[0].map(item => ({...item})), comparisons: state.comparisons });
      scene++;
      if (scene < modes.length) state = createMerge(modes[scene]);
      else if (kind !== 'compare') done = true;
      continue;
    }
    const match = /^pick:(left|right)$/.exec(action);
    if (!match || state.done) return null;
    const next = chooseMerge(state, match[1]);
    if (next.history.length !== state.history.length + 1) return null;
    state = next;
  }
  return { scene, mode: modes[scene] ?? null, state, results, done };
}
