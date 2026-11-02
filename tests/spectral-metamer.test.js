import test from 'node:test';
import assert from 'node:assert/strict';
import {spectralBands,spectralMaterials,spectralLights,spectralSensors,spectralMeasure,spectralCreate,spectralInspect,spectralRestore,spectralComplete} from '../src/spectral-metamer.js';
test('four-band reflected light and sensor dot products distinguish the two illuminants',()=>{
 for(const m of Object.keys(spectralMaterials))for(const l of Object.keys(spectralLights)){const r=spectralMeasure(m,l);assert.equal(r.reflected.length,spectralBands.length);for(let i=0;i<4;i++)assert.equal(r.reflected[i],spectralMaterials[m].reflectance[i]*spectralLights[l].power[i]);for(const name of ['R','G','B'])assert.equal(r.channels[name],r.reflected.reduce((sum,x,i)=>sum+x*spectralSensors[name][i],0));}
 assert.deepEqual(spectralMeasure('A','flat').channels,{R:0.5,G:0.5,B:0.5});assert.deepEqual(spectralMeasure('B','flat').channels,{R:0.5,G:0.5,B:0.5});assert.deepEqual(spectralMeasure('A','filtered').channels,{R:0.5,G:0.5,B:0.5});assert.deepEqual(spectralMeasure('B','filtered').channels,{R:0.5,G:0.25,B:0.25});
});
test('four inspections restore and both reflections are necessary',()=>{
 const q=spectralCreate();spectralInspect(q);assert.deepEqual(spectralRestore(q),q);assert.throws(()=>spectralRestore({...q,seen:['A:unknown']}));for(const m of ['A','B'])for(const l of ['flat','filtered']){q.material=m;q.light=l;spectralInspect(q);}q.spectrum='different';assert.equal(spectralComplete(q),false);q.lighting='change';assert.equal(spectralComplete(q),true);
});
