import test from 'node:test';
import assert from 'node:assert/strict';
import {randomSequence,randomFault,randomCreate,randomReady,randomCanFix,randomDone,randomRestore} from '../src/random-replay.js';

test('seeds produce reproducible but different finite sequences',()=>{
  assert.deepEqual(randomSequence(0,6),[1,6,15,12,13,2]);
  assert.deepEqual(randomSequence(7,6),[4,5,10,3,0,1]);
  assert.deepEqual(randomSequence(0,3),randomSequence(0,6).slice(0,3));
  assert.equal(randomSequence(0,6).some(n=>randomFault(n)),true);
  assert.equal(randomSequence(7,6).some(n=>randomFault(n)),false);
});
test('repair is permitted only after reproduction and comparison; fixed boundary is retested',()=>{
  const q=randomCreate();q.counts={0:6,7:6};assert.equal(randomReady(q),true);q.replay=3;q.cases=[7,11,12];assert.equal(randomCanFix(q),false);q.cases.push(15);assert.equal(randomCanFix(q),true);
  for(let n=0;n<16;n++){assert.equal(randomFault(n),n>=12);assert.equal(randomFault(n,true),false);}
  q.fixed=true;q.retests=[11,12,15];q.reflection='conditions';assert.equal(randomDone(q),true);
  const copy=randomRestore(q);copy.cases.pop();assert.equal(q.cases.length,4);
});
test('forged or out-of-order drafts are rejected',()=>{
  for(const q of [{...randomCreate(),replay:1},{...randomCreate(),cases:[12]},{...randomCreate(),fixed:true},{...randomCreate(),retests:[12]},{...randomCreate(),counts:{0:7,7:0}},{...randomCreate(),cases:[7,7]}])assert.throws(()=>randomRestore(q));
});
