import test from 'node:test';
import assert from 'node:assert/strict';
import {controlReplay,createControlTrial,restoreControlTrial} from '../src/game-control-alternative.js';
import {createCaptions,restoreCaptions} from '../src/game-captions.js';

test('one-at-a-time input blocks the chord but allows a sequential alternative',()=>{
 const chord=controlReplay('chord','one',['a','b','a','b']);
 assert.equal(chord.activated,false);assert.deepEqual(chord.down,['b']);
 assert.equal(controlReplay('chord','two',['a','b']).activated,true);
 assert.equal(controlReplay('sequence','one',['a','a','b']).activated,true);
 assert.equal(controlReplay('sequence','one',['b','b','a']).activated,false);
 assert.equal(controlReplay('sequence','one',['a','b']).activated,false);
});
test('control history is copied and old caption drafts retain their previous answers',()=>{
 const old=createCaptions();delete old.control;old.choices.generic.bridge={answer:'unknown',checked:true};
 const restored=restoreCaptions(old);assert.deepEqual(restored.control,createControlTrial());assert.equal(restored.choices.generic.bridge.checked,true);
 const saved={scheme:'sequence',limit:'one',history:['a','a']},copy=restoreControlTrial(saved);saved.history.push('b');assert.deepEqual(copy.history,['a','a']);
 assert.equal(restoreCaptions({...old,control:copy}).control.history.length,2);
 assert.throws(()=>restoreControlTrial({scheme:'bad',limit:'one',history:[]}));
 assert.throws(()=>restoreControlTrial({scheme:'chord',limit:'one',history:['bad']}));
 assert.throws(()=>controlReplay('chord','one',Array(41).fill('a')));
});
