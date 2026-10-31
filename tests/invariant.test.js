import test from 'node:test';
import assert from 'node:assert/strict';
import {books} from '../src/lookup.js';
import {createInvariant,invariantHolds,advanceInvariant,invariantStep,restoreInvariant,invariantComplete} from '../src/invariant.js';
test('correct search preserves the conditional invariant and finds exactly present targets across a range',()=>{
  for(let target=0;target<=18;target++){let s={...createInvariant('correct'),target};while(s.search==='playing'){assert.equal(invariantHolds(s),true);s=advanceInvariant(s);}assert.equal(invariantHolds(s),true);assert.equal(s.search==='found',books.includes(target));}
});
test('skipping one extra book breaks the invariant while absence does not',()=>{
  let bad=createInvariant('fault');bad=invariantStep(bad,'holds');assert.equal(invariantHolds(bad),false);assert.equal(invariantStep(bad,'holds').status,'playing');bad=invariantStep(bad,'broken');assert.equal(bad.status,'counterexample');
  let absent=createInvariant('absent');while(absent.status==='playing')absent=invariantStep(absent,'holds');assert.equal(absent.search,'missing');assert.equal(absent.status,'done');
});
test('restoration replays valid observations and requires all examples',()=>{
  const saved={selected:'fault',history:{correct:['holds','holds'],fault:['holds','broken'],absent:[]}};const state=restoreInvariant(saved);assert.equal(invariantComplete(state),false);assert.equal(state.states.fault.status,'counterexample');assert.throws(()=>restoreInvariant({...saved,history:{...saved.history,fault:['holds','holds']}}),RangeError);
});
