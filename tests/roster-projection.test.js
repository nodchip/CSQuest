import test from 'node:test';
import assert from 'node:assert/strict';
import {rosterProjection,rosterProjectionCases,createRosterProjection,rosterProjectionComplete,restoreRosterProjection} from '../src/roster-projection.js';

test('projected columns determine which rows are duplicates',()=>{
  assert.deepEqual(rosterProjection('nameAll'),[['アオ'],['アオ'],['ベニ'],['ベニ']]);
  assert.deepEqual(rosterProjection('nameDistinct'),[['アオ'],['ベニ']]);
  assert.deepEqual(rosterProjection('pairAll'),[['アオ','森'],['アオ','塔'],['ベニ','森'],['ベニ','森']]);
  assert.deepEqual(rosterProjection('pairDistinct'),[['アオ','森'],['アオ','塔'],['ベニ','森']]);
  assert.throws(()=>rosterProjection('unknown'));
});
test('four checked row counts and validated independent saved choices are required',()=>{
  const s=createRosterProjection();for(const [id,count] of Object.entries({nameAll:4,nameDistinct:2,pairAll:4,pairDistinct:3}))s.choices[id]={count,checked:true};
  assert.equal(rosterProjectionComplete(s),true);
  for(const id of Object.keys(rosterProjectionCases)){const changed=structuredClone(s);changed.choices[id].checked=false;assert.equal(rosterProjectionComplete(changed),false);}
  const copy=restoreRosterProjection(s);copy.choices.nameAll.count=1;assert.equal(s.choices.nameAll.count,4);assert.equal(rosterProjectionComplete(copy),false);
  assert.throws(()=>restoreRosterProjection({...s,choices:{...s.choices,pairAll:{count:8,checked:true}}}));
});
