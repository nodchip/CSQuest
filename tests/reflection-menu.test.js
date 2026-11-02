import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reflectionTypes,reflectionInitial,reflectionPerform,reflectionReplay,reflectionCreate,reflectionTry,reflectionComplete,reflectionRestore} from '../src/reflection-menu.js';

const actions=['inspect','build','glow','switch','glow','inspect','build','sprinkle'];
test('inspection builds a snapshot, old menu fails safely, refreshed menu reaches both goals',()=>{
 const s=reflectionInitial();for(let i=0;i<actions.length;i++){
  for(const wrong of ['inspect','build','switch','glow','sprinkle','rest'].filter(a=>a!==actions[i]))assert.throws(()=>reflectionPerform(structuredClone(s),wrong));
  reflectionPerform(s,actions[i]);assert.deepEqual(reflectionReplay(actions.slice(0,i+1)),s);
  if(i===1)assert.deepEqual(s.menu,reflectionTypes.lamp.methods);
  if(i===4){assert.equal(s.type,'rain');assert.equal(s.rainWater,1);assert.equal(s.watered,false);assert.match(s.last,/実行せず/);}
  if(i===6)assert.deepEqual(s.menu,reflectionTypes.rain.methods);
 }
 assert.equal(s.lit,true);assert.equal(s.watered,true);assert.equal(s.lampEnergy,0);assert.equal(s.rainWater,0);assert.throws(()=>reflectionPerform(s,'sprinkle'));
});
test('saved progression must replay valid choices and completion needs reflection',()=>{
 const q=reflectionCreate();assert.throws(()=>reflectionTry(q,'build'));for(const a of actions){reflectionTry(q,a);assert.deepEqual(reflectionRestore(q),q);}assert.equal(reflectionComplete(q),false);q.answer='inspect';assert.equal(reflectionComplete(q),true);const copy=reflectionRestore(q);copy.history.pop();assert.equal(q.history.length,8);assert.throws(()=>reflectionRestore({history:['build'],answer:'inspect'}));assert.throws(()=>reflectionRestore({history:actions,answer:'forged'}));
});
