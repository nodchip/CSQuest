import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {halftoneRanks,halftoneLevels,halftonePattern,halftoneCheckPattern,halftoneCreate,halftoneInspect,halftoneComplete,halftoneRestore} from '../src/halftone-press.js';

test('every pattern is checked against count and threshold order independently',()=>{
  assert.deepEqual(halftoneRanks,[0,2,3,1]);
  for(const level of halftoneLevels){const expected=halftonePattern(level);assert.equal(expected.filter(Boolean).length,level);
    for(let mask=0;mask<16;mask++){const cells=Array.from({length:4},(_,i)=>Boolean(mask&(1<<i))),result=halftoneCheckPattern(level,cells);
      assert.equal(result.countCorrect,cells.filter(Boolean).length===level);
      assert.equal(result.correct,cells.every((value,i)=>value===(halftoneRanks[i]<level)));
    }
  }
  assert.throws(()=>halftonePattern(5));assert.throws(()=>halftoneCheckPattern(1,[true]));
});
test('wrong layout does not advance; all five tones and reflection are required',()=>{
  const q=halftoneCreate();q.cells=[true,true,false,false];halftoneInspect(q);assert.equal(q.last.countCorrect,true);assert.equal(q.last.correct,false);assert.deepEqual(q.completed,[]);
  for(const n of halftoneLevels){q.level=n;q.cells=halftonePattern(n);halftoneInspect(q);}assert.equal(halftoneComplete(q),false);
  q.reflection='area';assert.equal(halftoneComplete(q),true);const copy=halftoneRestore(q);copy.cells[0]=false;assert.equal(q.cells[0],true);
  assert.throws(()=>halftoneRestore({...q,last:{...q.last,count:0}}));
});
