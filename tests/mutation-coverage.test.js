import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mutationInputs,mutationResults,createMutation,stepMutation,mutationComplete,restoreMutation} from '../src/mutation-coverage.js';
test('branch coverage alone misses both changes, and all small test sets are evaluated',()=>{
 const r=mutationResults([0,2]);assert.equal(r.accepted&&r.rejected,true);assert.equal(r.lowerCaught||r.upperCaught,false);for(let mask=0;mask<32;mask++){const selected=mutationInputs.filter((_,i)=>mask&(1<<i));if(selected.length>3)continue;const x=mutationResults(selected);assert.equal(x.lowerCaught,selected.includes(1));assert.equal(x.upperCaught,selected.includes(6));}assert.throws(()=>mutationResults([1,1]),RangeError);
});
test('the gap must be observed before completing and history is reconstructed',()=>{
 let s=createMutation();s=stepMutation(s,'run');assert.equal(s.seenGap,true);for(const a of ['toggle:2','toggle:1','toggle:6','run'])s=stepMutation(s,a);assert.equal(mutationComplete(s),true);const copy=restoreMutation({...s,selected:[]});assert.equal(mutationComplete(copy),true);assert.throws(()=>restoreMutation({history:['toggle:9']}),RangeError);
});
