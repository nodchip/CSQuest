// A deliberately small, read-only cache model. Each scene starts empty.
export const cacheCases = {
  temporal: [
    { width: 1, policy: 'lru', refs: [0, 1, 0, 1] },
    { width: 1, policy: 'lru', refs: [0, 1, 2, 0] },
    { width: 1, policy: 'lru', refs: [0, 1, 0, 2] },
  ],
  spatial: [
    { width: 2, policy: 'direct', refs: [0, 1, 2, 3] },
    { width: 2, policy: 'direct', refs: [0, 2, 4, 0] },
  ],
  mapping: [
    { width: 2, policy: 'direct', refs: [0, 4, 0, 4] },
    { width: 2, policy: 'lru', refs: [0, 4, 0, 4] },
  ],
};

// A player first predicts a hit/miss, then chooses the frame on a miss.
export function replayCache(kind, history) {
  const scenes = cacheCases[kind];
  if (!scenes || !Array.isArray(history)) return null;
  let scene = 0, index = 0, frames = [null, null], age = [], hits = 0, pending = false, done = false, results = [];
  const reset = () => { index = 0; frames = [null, null]; age = []; hits = 0; pending = false; };
  for (const action of history) {
    if (done || typeof action !== 'string') return null;
    if (action === 'reset') { reset(); continue; }
    const c = scenes[scene];
    if (action === 'next' && index === c.refs.length && !pending) {
      results.push(hits);
      scene++; done = scene === scenes.length;
      if (!done) reset();
      continue;
    }
    if (index >= c.refs.length) return null;
    const block = Math.floor(c.refs[index] / c.width), existing = frames.indexOf(block);
    if (!pending && action === 'hit' && existing !== -1) {
      hits++; index++; age = age.filter(x => x !== existing); age.push(existing); continue;
    }
    if (!pending && action === 'miss' && existing === -1) { pending = true; continue; }
    const match = /^frame:([01])$/.exec(action);
    if (pending && match) {
      const chosen = Number(match[1]);
      const target = c.policy === 'direct' ? block % 2 : frames.includes(null) ? frames.indexOf(null) : age[0];
      if (chosen !== target) return null;
      frames[chosen] = block; age = age.filter(x => x !== chosen); age.push(chosen);
      pending = false; index++; continue;
    }
    return null;
  }
  return { scene, index, frames, age, hits, pending, done, results };
}
