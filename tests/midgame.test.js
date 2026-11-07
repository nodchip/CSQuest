import test from 'node:test';
import assert from 'node:assert/strict';
import {midReplay,validMidDrafts,midUnlocked,bridgeReady} from '../src/midgame.js';

test('search can find the target along different valid comparisons and rejects impossible histories',()=>{
  for(const path of [['pick:3','pick:5','pick:4'],['pick:0','pick:4']])assert.equal(midReplay('archive-search',path).done,true);
  const partial=midReplay('archive-search',['pick:3','pick:5']);assert.deepEqual([partial.lo,partial.hi],[4,4]);
  assert.throws(()=>midReplay('archive-search',['pick:3','pick:1']));
  assert.throws(()=>midReplay('archive-search',['pick:4','pick:3']));
});
test('both independent book conditions and tested correct lamp select the intended results',()=>{
  assert.deepEqual(midReplay('archive-filter',['book','mountain','test']).books.map(x=>x.name),['山の薬草図鑑','山道の手引き']);
  assert.equal(midReplay('archive-filter',['book','test']).done,false);
  assert.equal(midReplay('archive-filter',['mountain','book','test']).done,true);
  const lamp=midReplay('windmill-lamp',['AND','test']);
  assert.equal(lamp.done,true);assert.deepEqual(lamp.rows.map(row=>row.actual),[0,0,0,1]);
  assert.equal(midReplay('windmill-lamp',['OR','test']).done,false);
  assert.deepEqual(midReplay('windmill-lamp',['NAND','test']).rows.map(row=>row.actual),[1,1,1,0]);
  assert.deepEqual(midReplay('windmill-lamp',['OR','test']).rows.map(row=>row.actual),[0,1,1,1]);
  assert.equal(midReplay('archive-filter',['test']).done,false);
  assert.equal(midReplay('archive-filter',['mountain','test']).done,false);
});
test('both preparation orders respect dependencies and bridge requires one real quest from each region',()=>{
  for(const order of [['A','B','C','D'],['A','C','B','D']])assert.equal(midReplay('windmill-order',order).done,true);
  assert.throws(()=>midReplay('windmill-order',['D']));assert.throws(()=>midReplay('windmill-order',['A','B','D']));
  assert.equal(midUnlocked(['harbor-message']),true);assert.equal(midUnlocked(['city-sort']),false);
  assert.equal(bridgeReady(['archive-search','windmill-lamp']),true);assert.equal(bridgeReady(['archive-search','archive-filter']),false);
  assert.equal(validMidDrafts({'archive-search':['pick:3'],'windmill-order':['A']}),true);
  assert.equal(validMidDrafts({'windmill-order':['D']}),false);assert.equal(validMidDrafts({'<bad>':[]}),false);
  const permutations=items=>items.length?items.flatMap((item,index)=>permutations(items.filter((_,i)=>i!==index)).map(rest=>[item,...rest])):[[]];
  const accepted=permutations(['A','B','C','D']).filter(order=>{try{return midReplay('windmill-order',order).done;}catch{return false;}});
  assert.deepEqual(accepted,[['A','B','C','D'],['A','C','B','D']]);
});
