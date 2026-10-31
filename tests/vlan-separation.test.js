import {test} from 'node:test';
import assert from 'node:assert/strict';
import {vlanRun,vlanComplete,restoreVlan} from '../src/vlan-separation.js';
test('unknown unicast floods only within the ingress group and same-group learned unicast works',()=>{const r=vlanRun(['ac','toggle','ac','ba']);assert.deepEqual(r.events[0].out,[2,3]);assert.equal(r.events[0].delivered,true);assert.deepEqual(r.events[2].out,[2]);assert.equal(r.events[2].delivered,false);assert.deepEqual(r.events[3].out,[1]);assert.equal(r.events[3].delivered,true);assert.equal(r.stage,4);});
test('the comparison and same-group delivery are required and history is replayed on restore',()=>{const s={history:['ac','toggle','ac']},copy=restoreVlan(s);assert.equal(vlanComplete(copy),false);s.history.push('ba');assert.equal(vlanComplete(s),true);assert.equal(copy.history.length,3);assert.throws(()=>restoreVlan({history:['bad']}),RangeError);});
