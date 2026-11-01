import test from 'node:test';
import assert from 'node:assert/strict';
import {createGibbs,gibbsState,gibbsComplete,restoreGibbs} from '../src/gibbs-lamps.js';

test('conditionals follow the independently enumerated joint weights',()=>{
 const weights=[[1,3],[3,1]];
 for(const fixed of [0,1]){
  assert.equal(100*weights[1][fixed]/(weights[0][fixed]+weights[1][fixed]),fixed===0?75:25);
  assert.equal(100*weights[fixed][1]/(weights[fixed][0]+weights[fixed][1]),fixed===0?75:25);
 }
 const history=[1,0,0,1,0,1],r=gibbsState(history);
 assert.deepEqual(r.samples,[{x:1,y:0},{x:0,y:1},{x:0,y:1}]);
 assert.equal(r.samples.filter(v=>v.x===1).length,1);
 assert.throws(()=>gibbsState([0]));
 const s=createGibbs();s.history=history;s.answer='finite';s.checked=true;assert.equal(gibbsComplete(s),true);
 const copy=restoreGibbs(s);copy.history.pop();assert.equal(s.history.length,6);
 assert.throws(()=>restoreGibbs({...s,history:[0]}));
});
