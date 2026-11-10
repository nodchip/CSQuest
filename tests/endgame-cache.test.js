import test from 'node:test';
import assert from 'node:assert/strict';
import { replayCache } from '../src/endgame-cache.js';

test('temporal reuse, cold misses, and least recently used replacement', () => {
  const first = ['miss','frame:0','miss','frame:1','hit','hit'];
  assert.equal(replayCache('temporal', first).hits, 2);
  assert.equal(replayCache('temporal', ['hit']), null);
  const second = ['miss','frame:0','miss','frame:1','miss','frame:0','miss','frame:1'];
  assert.equal(replayCache('temporal', [...first,'next',...second]).hits, 0);
  const third = ['miss','frame:0','miss','frame:1','hit','miss','frame:1'];
  assert.equal(replayCache('temporal', [...first,'next',...second,'next',...third]).hits, 1);
  assert.equal(replayCache('temporal', [...first,'next',...second,'next',...third,'next']).done, true);
  assert.equal(replayCache('temporal', [...first,'next',...second,'next',...third.slice(0,-1),'frame:0']), null);
  assert.equal(replayCache('temporal', [...first,'next','miss','frame:1']), null);
});

test('spatial blocks and direct mapping include both addresses', () => {
  const first = ['miss','frame:0','hit','miss','frame:1','hit'];
  assert.equal(replayCache('spatial', first).hits, 2);
  const second = ['miss','frame:0','miss','frame:1','miss','frame:0','miss','frame:0'];
  assert.equal(replayCache('spatial', [...first,'next',...second]).hits, 0);
  assert.equal(replayCache('spatial', [...first,'next',...second,'next']).done, true);
});

test('same-size direct and associative caches differ on conflicting blocks', () => {
  const direct = ['miss','frame:0','miss','frame:0','miss','frame:0','miss','frame:0'];
  const associative = ['miss','frame:0','miss','frame:1','hit','hit'];
  assert.equal(replayCache('mapping', direct).hits, 0);
  assert.equal(replayCache('mapping', [...direct,'next',...associative]).hits, 2);
  assert.equal(replayCache('mapping', [...direct,'next',...associative,'next']).done, true);
  assert.equal(replayCache('mapping', ['miss','frame:1']), null);
  assert.deepEqual(replayCache('mapping', ['miss','frame:0','reset']).frames, [null,null]);
});
