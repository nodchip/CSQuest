import test from 'node:test';
import assert from 'node:assert/strict';
import {safetyCases,safetyOutput,safetyReplay,safetyCaseDone,safetyCreate,safetyRestore,safetyDone} from '../src/safety-conditions.js';
const trial=(id,mask,repaired=false)=>({type:'test',mask,guess:safetyOutput(id,mask,repaired).actual});
test('all eight inputs obey the specified decision, and three faults are distinguishable',()=>{
 for(let m=0;m<8;m++){
  assert.equal(safetyOutput('good',m).actual,m===7);
  assert.equal(safetyOutput('sensor',m).actual,!!(m&1)&&!!(m&2));
  assert.equal(safetyOutput('level',m).actual,!!(m&1)&&!!(m&4));
  assert.equal(safetyOutput('stuck',m).actual,true);
  for(const id of Object.keys(safetyCases))assert.equal(safetyOutput(id,m,true).actual,m===7);
 }
});
test('independent condition pairs, witnessed fault, repair and same-input retest are required',()=>{
 const q=safetyCreate();q.histories.good=[7,6,5,3].map(m=>trial('good',m));for(const [id,mask] of [['sensor',3],['level',5],['stuck',6]])q.histories[id]=[trial(id,mask),{type:'repair'},trial(id,mask,true)];
 for(const id of Object.keys(safetyCases))assert.equal(safetyCaseDone(id,q.histories[id]),true);q.reflection='limits';assert.equal(safetyDone(q),true);const copy=safetyRestore(q);copy.histories.good.pop();assert.equal(q.histories.good.length,4);
 assert.throws(()=>safetyReplay('sensor',[{type:'repair'}]));assert.throws(()=>safetyReplay('sensor',[{type:'test',mask:3,guess:false}]));assert.equal(safetyCaseDone('sensor',[trial('sensor',3),{type:'repair'},trial('sensor',7,true)]),false);
});
