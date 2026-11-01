import test from 'node:test';
import assert from 'node:assert/strict';
import {emulationOutcome,emulationCreate,emulationTry,emulationRestore,emulationComplete,emulationRequired} from '../src/emulation-isolation.js';

test('all eight combinations distinguish instruction compatibility from the access boundary',()=>{
 for(const isa of ['same','foreign'])for(const engine of ['native','emulated'])for(const wall of ['open','wall']){
  const outcome=emulationOutcome(isa,engine,wall);
  assert.equal(outcome,isa==='foreign'&&engine==='native'?'stopped':wall==='wall'?'denied':'visible');
 }
 assert.throws(()=>emulationOutcome('other','native','wall'));
});
test('only correct predictions record a configuration and all five observations are required',()=>{
 const s=emulationCreate();assert.equal(emulationTry(s),false);s.prediction='denied';assert.equal(emulationTry(s),false);assert.deepEqual(s.observed,[]);
 for(const key of emulationRequired){[s.isa,s.engine,s.wall]=key.split('-');s.prediction=emulationOutcome(s.isa,s.engine,s.wall);assert.equal(emulationTry(s),true);assert.equal(emulationComplete(s),key===emulationRequired.at(-1));assert.equal(emulationTry(s),true);}
 assert.equal(s.observed.length,5);const copy=emulationRestore(s);copy.observed.pop();assert.equal(s.observed.length,5);assert.throws(()=>emulationRestore({...s,observed:['same-native-open','same-native-open']}));assert.throws(()=>emulationRestore({...s,observed:['foreign-native-broken']}));
});
