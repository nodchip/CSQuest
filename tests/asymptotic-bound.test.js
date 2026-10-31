import test from 'node:test';
import assert from 'node:assert/strict';
import {boundCounts,boundWinner,createBound,boundComplete,restoreBound} from '../src/asymptotic-bound.js';
test('constant factor reverses the comparison across the threshold',()=>{assert.deepEqual([4,8,16].map(boundCounts),[{linear:32,pairs:16},{linear:64,pairs:64},{linear:128,pairs:256}]);assert.deepEqual([4,8,16].map(boundWinner),['pairs','same','linear']);assert.throws(()=>boundCounts(0));});
test('all comparisons and upper-bound interpretation are required',()=>{const s=createBound();for(const n of [4,8,16])s.trials[n]={guess:boundWinner(n),checked:true};s.answer='upper';s.checked=true;assert.equal(boundComplete(s),true);const copy=restoreBound(s);copy.trials[8].guess='linear';assert.equal(boundComplete(copy),false);assert.equal(boundComplete(s),true);assert.throws(()=>restoreBound({...s,size:12}));});
