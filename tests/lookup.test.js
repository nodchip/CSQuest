import test from 'node:test';
import assert from 'node:assert/strict';
import {books,createLookup,inspectBook,restoreLookup} from '../src/lookup.js';
function run(target,method){let state=createLookup(target,method);while(state.status==='playing'){const index=method==='linear'?state.lo:Math.floor((state.lo+state.hi)/2);state=inspectBook(state,index);}return state;}
test('both methods find present and reject absent values with correct comparison counts',()=>{
  assert.equal(run('present','linear').visited.length,7);assert.equal(run('present','binary').visited.length,3);
  assert.equal(run('missing','linear').visited.length,8);assert.equal(run('missing','binary').visited.length,3);
  assert.equal(run('present','binary').status,'found');assert.equal(run('missing','binary').status,'missing');
});
test('wrong choice does not change candidates and each binary elimination is justified',()=>{
  let state=createLookup('present','binary');assert.equal(inspectBook(state,0).visited.length,0);
  for(const i of [3,5,6]){const prior=state;state=inspectBook(state,i);if(state.status==='playing')for(let j=prior.lo;j<=prior.hi;j++)if(j<state.lo||j>state.hi)assert.notEqual(books[j],14);}
});
test('four independent trials restore only valid histories',()=>{
  const h={present:{linear:[0,1],binary:[3]},missing:{linear:[],binary:[3,5]}};
  const restored=restoreLookup({target:'missing',method:'binary',history:h});assert.equal(restored.states.missing.binary.lo,4);assert.equal(restored.states.missing.binary.hi,4);
  assert.throws(()=>restoreLookup({target:'present',method:'linear',history:{...h,present:{linear:[1],binary:[]}}}),RangeError);
});
