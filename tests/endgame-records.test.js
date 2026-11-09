import test from 'node:test';
import assert from 'node:assert/strict';
import {replayRecords} from '../src/endgame-records.js';

test('three shipments, including an empty result, use matching destination numbers',()=>{
 const actions=['select:B','select:A','check','join:A:10','join:B:20','check','choose:A','check','column:id',
  'select:D','select:E','check','join:E:40','join:D:30','check','choose:E','check','column:id',
  'select:G','select:I','check','join:G:50','join:I:60','check','check','column:id'];
 const state=replayRecords(actions);assert.equal(state.done,true);assert.deepEqual(state.results,[['A'],['E'],[]]);
 assert.equal(replayRecords([...actions,'check']),null);
});
test('wrong filters, joins, target rows and columns cannot complete a step',()=>{
 assert.equal(replayRecords(['check']),null);
 assert.equal(replayRecords(['select:A','select:C','check']),null);
 assert.equal(replayRecords(['select:A','select:B','check','join:A:20']),null);
 assert.equal(replayRecords(['select:A','select:B','check','join:A:10','join:B:20','check','choose:B','check']),null);
 assert.equal(replayRecords(['select:A','select:B','check','join:A:10','join:B:20','check','choose:A','check','column:place']),null);
});
