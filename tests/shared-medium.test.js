import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mediumRun,mediumComplete,restoreMedium} from '../src/shared-medium.js';
test('a simultaneous attempt collides, and separate attempts deliver the pending packets',()=>{const r=mediumRun([{a:true,b:true},{a:true,b:false},{a:false,b:true}]);assert.deepEqual(r.events.map(e=>e.result),['collision','a','b']);assert.deepEqual(r.pending,{a:false,b:false});assert.equal(mediumComplete({history:[{a:true,b:true},{a:true,b:false},{a:false,b:true}]}),true);assert.throws(()=>mediumRun([{a:true,b:false},{a:true,b:false}]),RangeError);});
test('delivery alone without observing a collision is not complete; saved choices are validated and copied',()=>{const s={history:[{a:true,b:false},{a:false,b:true}],a:false,b:false};assert.equal(mediumComplete(s),false);const copy=restoreMedium(s);s.history[0].a=false;assert.equal(copy.history[0].a,true);assert.throws(()=>restoreMedium({...copy,a:true}),RangeError);});
