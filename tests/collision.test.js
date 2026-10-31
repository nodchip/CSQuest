import test from 'node:test';
import assert from 'node:assert/strict';
import {collisionCases,sweptIntersection,createCollision,collisionStep,collisionCorrect,createCollisionSet,restoreCollision,collisionComplete} from '../src/collision.js';

test('segment intersection covers either direction, endpoints and misses',()=>{
  for(let a=0;a<=10;a++)for(let b=0;b<=10;b++){
    const expected=!(a<4&&b<4)&&!(a>6&&b>6);assert.equal(sweptIntersection(a,b,4,6),expected);assert.equal(sweptIntersection(a,b,4,6),sweptIntersection(b,a,4,6));
  }
  assert.throws(()=>sweptIntersection(0,1,6,4),RangeError);
});
test('fast sampling tunnels, swept detects, slow sampling hits the boundary',()=>{
  let fast=collisionStep(createCollision('fast','sample'));assert.equal(fast.status,'passed');assert.equal(fast.position,10);
  let swept=collisionStep(createCollision('fast','swept'));assert.equal(swept.status,'detected');assert.equal(swept.position,4);
  let slow=collisionStep(createCollision('slow','sample'));assert.equal(slow.status,'travel');slow=collisionStep(slow);assert.equal(slow.position,4);assert.equal(slow.status,'detected');
  assert.equal(collisionCorrect('miss',fast),true);assert.equal(collisionCorrect('sweep',swept),true);assert.equal(collisionCorrect('small',slow),true);
});
test('saved configurations replay reachable steps and all cases are required',()=>{
  const saved={selected:'miss',states:{miss:{speed:'fast',mode:'sample',steps:1},sweep:{speed:'fast',mode:'swept',steps:1},small:{speed:'slow',mode:'sample',steps:2}}};
  const state=restoreCollision(saved);assert.equal(collisionComplete(state),true);assert.equal(collisionComplete(createCollisionSet()),false);
  assert.throws(()=>restoreCollision({...saved,states:{...saved.states,miss:{speed:'fast',mode:'sample',steps:2}}}),RangeError);assert.throws(()=>createCollision('unknown','sample'),RangeError);
  assert.equal(Object.keys(collisionCases).length,3);
});
