import test from 'node:test';
import assert from 'node:assert/strict';
import {translateAddress,recoverMissingPage,checkAddress,createAddress,restoreAddress,addressComplete} from '../src/address.js';

test('all logical addresses translate to the correct frame, fault or protection outcome',()=>{
  for(let address=0;address<16;address++)for(const write of [false,true]){
    const page=Math.floor(address/4),offset=address%4;
    const expected=page===1?'fault':page===3&&write?'denied':`physical:${[8,0,0,4][page]+offset}`;
    assert.deepEqual(translateAddress(address,write),{page,offset,outcome:expected});
  }
  assert.throws(()=>translateAddress(16,false),RangeError);assert.throws(()=>translateAddress(1,'read'),RangeError);
});
test('all seven cases require the page, offset and outcome to be checked',()=>{
  const state=createAddress();
  for(const [id,page,offset,outcome] of [['read0',0,2,'physical:10'],['missing',1,1,'fault'],['protected',3,1,'denied'],['read2',2,3,'physical:3'],['readProtected',3,1,'physical:5'],['write0',0,2,'physical:10'],['missingWrite',1,1,'fault']])state.choices[id]={page,offset,outcome,tested:true};
  assert.equal(addressComplete(state),true);state.choices.read0.offset=1;assert.equal(checkAddress('read0',state.choices.read0).offset,false);assert.equal(addressComplete(state),false);
});
test('restoration validates choices and copies them',()=>{
  const saved=createAddress();saved.choices.read0.page=0;const restored=restoreAddress(saved);saved.choices.read0.page=3;assert.equal(restored.choices.read0.page,0);
  assert.throws(()=>restoreAddress({...saved,selected:'unknown'}),RangeError);saved.choices.read0.outcome='physical:12';assert.throws(()=>restoreAddress(saved),RangeError);
});

test('same address distinguishes access permission and missing-page outcomes, with legacy drafts restored',()=>{assert.equal(translateAddress(13,false).outcome,'physical:5');assert.equal(translateAddress(13,true).outcome,'denied');assert.equal(translateAddress(2,false).outcome,translateAddress(2,true).outcome);assert.equal(translateAddress(5,false).outcome,'fault');assert.equal(translateAddress(5,true).outcome,'fault');const old=createAddress();old.choices.read0={page:0,offset:2,outcome:'physical:10',tested:true};for(const key of ['readProtected','write0','missingWrite'])delete old.choices[key];const restored=restoreAddress(old);assert.equal(restored.choices.read0.tested,true);assert.equal(restored.choices.readProtected.tested,false);assert.equal(addressComplete(restored),false);});

test('a selected victim supplies its frame while its old page becomes absent',()=>{for(const [victim,frame] of [[0,2],[2,0],[3,1]])assert.deepEqual(recoverMissingPage(victim),{victim,frame,newPhysical:frame*4+1,victimPresent:false});assert.throws(()=>recoverMissingPage(1),RangeError);const old=createAddress();delete old.recovery;assert.equal(restoreAddress(old).recovery,null);old.recovery=3;assert.equal(restoreAddress(old).recovery,3);old.recovery=1;assert.throws(()=>restoreAddress(old),RangeError);});
