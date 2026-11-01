import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hearthStages,createEmbeddedHearth,hearthSnapshot,hearthAdvance,hearthObserve,hearthPowerCycle,embeddedHearthComplete,restoreEmbeddedHearth} from '../src/embedded-hearth.js';

test('２温度で部品を順に使い、測定と比較と出力を区別する',()=>{
 for(const temperature of [16,24]){const s=createEmbeddedHearth();s.temperature=temperature;assert.equal(hearthAdvance(s,'output'),false);assert.equal(s.stage,0);assert.equal(hearthObserve(s),false);assert.equal(hearthSnapshot(s).ram,null);
  for(const [i,action] of hearthStages.entries()){assert.equal(hearthAdvance(s,action),true);const r=hearthSnapshot(s);assert.equal(r.loaded,true);assert.equal(r.ram,i>=1?temperature:null);assert.equal(r.comparison,i>=2?temperature<20:null);assert.equal(r.heater,i>=3&&temperature<20);}
  assert.equal(hearthAdvance(s,undefined),false);assert.equal(hearthObserve(s),true);assert.deepEqual(s.observed,[temperature===16?'cold':'warm']);
 }
});
test('電源の入れ直しで作業状態は消え、手順は残る',()=>{
 const s=createEmbeddedHearth();for(const a of hearthStages)hearthAdvance(s,a);hearthObserve(s);hearthPowerCycle(s);
 assert.deepEqual(hearthSnapshot(s),{firmware:true,loaded:false,ram:null,comparison:null,heater:false});assert.deepEqual(s.observed,['cold','reset']);
 s.temperature=24;for(const a of hearthStages)hearthAdvance(s,a);hearthObserve(s);s.answer='memory';assert.equal(embeddedHearthComplete(s),false);s.checked=true;assert.equal(embeddedHearthComplete(s),true);
});
test('途中状態を検証して複製する',()=>{
 const s=createEmbeddedHearth();s.observed=['cold'];const r=restoreEmbeddedHearth(s);r.observed.push('warm');assert.deepEqual(s.observed,['cold']);
 for(const p of [{temperature:20},{stage:5},{stage:1.5},{observed:['cold','cold']},{observed:['bad']},{answer:'bad'},{checked:1}])assert.throws(()=>restoreEmbeddedHearth({...s,...p}),RangeError);
});
