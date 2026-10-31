import test from 'node:test';
import assert from 'node:assert/strict';
import {threatResult,createThreat,restoreThreat,threatComplete} from '../src/threat-planning.js';
test('bounded plans preserve every unaddressed route and compute fixed impact sum',()=>{
 assert.deepEqual(threatResult('limited',['message','backup']),{remaining:['gate'],score:2});assert.equal(threatResult('limited',['gate','backup']).score,5);assert.equal(threatResult('expanded',['gate','message','backup']).score,0);assert.throws(()=>threatResult('limited',['gate','message','backup']));assert.throws(()=>threatResult('limited',['gate','gate']));
});
test('both tested plans and explicit residual-risk understanding are required',()=>{
 const s=createThreat();s.plans.limited=['message','backup'];s.plans.expanded=['gate','message','backup'];s.tested.limited=true;s.tested.expanded=true;s.answer='residual';s.checked=true;assert.equal(threatComplete(s),true);const copy=restoreThreat(s);copy.plans.limited.pop();assert.equal(threatComplete(copy),false);assert.equal(threatComplete(s),true);
});
