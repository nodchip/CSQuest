import test from 'node:test';
import assert from 'node:assert/strict';
import {edges,places,destinations,createHorn,deriveHorn,checkHorn,hornComplete,restoreHorn} from '../src/horn-routes.js';

test('every chosen route is derived exactly when both facts support it',()=>{
  for(const from of Object.keys(places))for(const middle of Object.keys(places))for(const to of Object.keys(places)){
    const state={...createHorn(),selected:{from,middle,to}},result=deriveHorn(state);
    const valid=edges.some(([a,b])=>a===from&&b===middle)&&edges.some(([a,b])=>a===middle&&b===to);
    assert.equal(result.proofs.length,Number(valid));
  }
  assert.deepEqual(new Set(destinations),new Set(['c','e']));
});
test('all destinations are needed and restored proofs must be valid',()=>{
  let state=createHorn();state.selected={from:'a',middle:'b',to:'c'};state=deriveHorn(state);state=checkHorn(state);assert.equal(hornComplete(state),false);
  state.selected={from:'a',middle:'d',to:'e'};state=deriveHorn(state);state=checkHorn(state);assert.equal(hornComplete(state),true);
  assert.equal(hornComplete(restoreHorn(state)),true);
  assert.throws(()=>restoreHorn({...state,proofs:[{from:'a',middle:'b',to:'e'}]}));
  assert.throws(()=>restoreHorn({...state,proofs:[state.proofs[0],state.proofs[0]]}));
});
