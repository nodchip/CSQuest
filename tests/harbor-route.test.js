import test from 'node:test';
import assert from 'node:assert/strict';
import {harborUnlocked,validHarborRoute,harborNext,harborDelivered} from '../src/harbor-route.js';

test('a village or city quest opens the harbor',()=>{
  assert.equal(harborUnlocked(['forest','branch']),false);
  for(const id of ['river','city-sort','city-queue'])assert.equal(harborUnlocked([id]),true);
});
test('both connected routes deliver; the fog path can be retraced',()=>{
  for(const first of ['light','village']){
    const route=[first,'hill','home'];
    assert.equal(validHarborRoute(route),true);
    assert.equal(harborDelivered(route),true);
  }
  assert.equal(validHarborRoute(['fog']),true);
  assert.deepEqual(harborNext(['fog']),[]);
  assert.equal(harborDelivered(['fog']),false);
  for(const bad of [['home'],['fog','hill'],['light','village'],['light','hill','home','port'],['<img>']])assert.equal(validHarborRoute(bad),false);
});
