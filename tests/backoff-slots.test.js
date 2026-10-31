import {test} from 'node:test';
import assert from 'node:assert/strict';
import {backoffResult,createBackoff,backoffComplete,restoreBackoff} from '../src/backoff-slots.js';
test('four possible independent choices include two separated attempts and two collisions',()=>{assert.deepEqual(backoffResult(0,0),['collision','idle']);assert.deepEqual(backoffResult(0,1),['a','b']);assert.deepEqual(backoffResult(1,0),['b','a']);assert.deepEqual(backoffResult(1,1),['idle','collision']);assert.throws(()=>backoffResult(2,0),RangeError);});
test('all outcomes and the checked comparison are required and restored records are independent',()=>{const s=createBackoff();s.seen=['00','01','10','11'];s.answer='half';s.checked=true;const copy=restoreBackoff(s);s.seen.pop();assert.equal(backoffComplete(s),false);assert.equal(backoffComplete(copy),true);assert.throws(()=>restoreBackoff({...copy,seen:['00','00']}),RangeError);});
