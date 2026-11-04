import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gestureCreate,gestureDirection,gestureMove,gestureDone,gestureRestore} from '../src/gesture-map.js';

test('horizontal movements need a 40-pixel threshold and horizontal dominance',()=>{assert.equal(gestureDirection(-40,0),1);assert.equal(gestureDirection(40,0),-1);assert.equal(gestureDirection(39,0),0);assert.equal(gestureDirection(40,40),0);assert.equal(gestureDirection(-60,61),0);assert.throws(()=>gestureDirection(NaN,0));});
test('both sides, an explanation, bounds and independent saved state',()=>{const q=gestureCreate();gestureMove(q,-1);gestureMove(q,-1);assert.equal(q.position,0);gestureMove(q,1);gestureMove(q,1);assert.equal(gestureDone(q),false);q.reflection='alternative';assert.equal(gestureDone(q),true);const copy=gestureRestore(q);copy.visited[0]=false;assert.equal(q.visited[0],true);assert.throws(()=>gestureRestore({...q,position:4}));assert.throws(()=>gestureRestore({...q,visited:[false,true,false]}));});
