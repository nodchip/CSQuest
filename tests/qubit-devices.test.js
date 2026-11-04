import test from 'node:test';
import assert from 'node:assert/strict';
import {deviceCases,deviceChoices,deviceCreate,deviceCorrect,deviceCheck,deviceDone,deviceRestore} from '../src/qubit-devices.js';
test('each configured apparatus requires its own preparation, control and readout',()=>{
 const q=deviceCreate();
 for(const [id,c] of Object.entries(deviceCases)){
  q.selected=id;
  for(const setup of Object.keys(deviceChoices.setup))for(const control of Object.keys(deviceChoices.control))for(const readout of Object.keys(deviceChoices.readout)){
   q.choices[id]={setup,control,readout};
   assert.equal(deviceCorrect(q),setup===c.setup&&control===c.control&&readout===c.readout);
  }
  q.choices[id]={setup:c.setup,control:c.control,readout:c.readout};assert.equal(deviceCheck(q),true);
 }
 q.reflection='examples';assert.equal(deviceDone(q),true);q.choices.ion.control='microwave';assert.equal(deviceDone(q),false);
});
test('wrong trials do not count, records restore independently, bad saved values are rejected',()=>{
 const q=deviceCreate();assert.equal(deviceCheck(q),false);assert.deepEqual(q.seen,[]);
 const copy=deviceRestore(q);copy.choices.circuit.setup='cold';assert.equal(q.choices.circuit.setup,null);
 assert.throws(()=>deviceRestore({...q,seen:['ion','ion']}),RangeError);
 assert.throws(()=>deviceRestore({...q,choices:{...q.choices,ion:{...q.choices.ion,setup:'bogus'}}}),RangeError);
});
