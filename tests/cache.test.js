import test from 'node:test';
import assert from 'node:assert/strict';
import {patterns,createCache,accessNext,restoreCache} from '../src/cache.js';
function run(pattern){let s=createCache(pattern);for(const book of patterns[pattern].requests)s=accessNext(s,s.shelf.includes(book)?'hit':'miss');return s;}
test('same books in different order yield different cache hits and total cost',()=>{
  const a=run('grouped'),b=run('rotating');assert.deepEqual([...patterns.grouped.requests].sort(),[...patterns.rotating.requests].sort());
  assert.equal(a.hits,3);assert.equal(a.time,21);assert.equal(b.hits,0);assert.equal(b.time,36);
  assert.deepEqual(a.history.map(x=>x.hit),[false,false,true,true,false,true]);
});
test('least recently used book is evicted and mistaken predictions do not advance',()=>{
  let s=createCache('grouped');const wrong=accessNext(s,'hit');assert.equal(wrong.index,0);assert.deepEqual(wrong.shelf,[]);
  for(const p of ['miss','miss','hit','hit','miss'])s=accessNext(s,p);
  assert.deepEqual(s.shelf,['B','C']);assert.equal(s.history.at(-1).evicted,'A');
});
test('partial independent trials restore from validated progress',()=>{
  const restored=restoreCache({selected:'rotating',index:{grouped:4,rotating:3}});
  assert.equal(restored.states.grouped.hits,2);assert.deepEqual(restored.states.rotating.shelf,['B','C']);
  assert.throws(()=>restoreCache({selected:'rotating',index:{grouped:7,rotating:0}}),RangeError);
  assert.throws(()=>restoreCache({selected:'unknown',index:{grouped:0,rotating:0}}),RangeError);
});
