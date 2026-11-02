import {test} from 'node:test';
import assert from 'node:assert/strict';
import {airResult,airCreate,airRun,airRestore,airComplete} from '../src/air-sampling.js';

test('each fixed series records times, missing readings, detections and energy',()=>{
 const expected={
  'peaks:1':[['clear','clear','high','high','clear','high','clear','clear'],16,[true,true]],
  'peaks:2':[['clear','high','clear','clear'],8,[true,false]],
  'peaks:4':[['clear','clear'],4,[false,false]],
  'outage:1':[['clear','clear','clear','clear','missing','high','clear','clear'],16,[true]],
  'outage:2':[['clear','clear','missing','clear'],8,[false]],
  'outage:4':[['clear','missing'],4,[false]],
 };
 for(const [key,[values,energy,detected]] of Object.entries(expected)){const [id,n]=key.split(':'),r=airResult(id,Number(n));assert.deepEqual(r.samples.map(x=>x.value),values);assert.deepEqual(r.samples.map(x=>x.time),values.map((_,i)=>i*Number(n)));assert.equal(r.energy,energy);assert.deepEqual(r.detected,detected);}
 assert.throws(()=>airResult('outage',3));
});
test('every observation and a sound conclusion are required; restored data are independent and validated',()=>{
 let q=airCreate();for(const id of ['peaks','outage'])for(const interval of [1,2,4]){q.selected=id;q.interval=interval;airRun(q);airRun(q);q=airRestore(q);}assert.equal(q.runs.length,6);assert.equal(airComplete(q),false);q.answer='clear';assert.equal(airComplete(q),false);q.answer='limits';assert.equal(airComplete(q),true);const copy=airRestore(q);copy.runs.pop();assert.equal(airComplete(q),true);assert.equal(airComplete(copy),false);assert.throws(()=>airRestore({...q,runs:['outage:01']}));assert.throws(()=>airRestore({...q,runs:['outage:1','outage:1']}));
});
