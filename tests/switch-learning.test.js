import {test} from 'node:test';
import assert from 'node:assert/strict';
import {switchRun,switchComplete,restoreSwitch} from '../src/switch-learning.js';
test('unknown destinations flood, learned destinations unicast, and a move is relearned from the source',()=>{
 const r=switchRun(['ab','ba','move','ba','ab','ba']);assert.deepEqual(r.events[0].ports,[2,3]);assert.deepEqual(r.events[1].ports,[1]);assert.equal(r.events[3].delivered,false);assert.deepEqual(r.events[4].table,{A:3,B:2});assert.deepEqual(r.events[5].ports,[3]);assert.equal(r.events[5].delivered,true);assert.equal(r.stage,6);
});
test('all observations are required and restore validates and replays history',()=>{const s={history:['ab','ba','move','ba','ab']},copy=restoreSwitch(s);assert.equal(switchComplete(copy),false);s.history.push('ba');assert.equal(switchComplete(s),true);assert.equal(copy.history.length,5);assert.throws(()=>restoreSwitch({history:['bad']}),RangeError);});
