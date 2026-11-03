import test from 'node:test';
import assert from 'node:assert/strict';
import {featureCuts,featureData,featureEvaluate,featureMarker,featureCreate,featureRestore,featureDone,featureMarkers} from '../src/square-features.js';
test('thresholds and polarity match independent predictions for every condition',()=>{
 for(const mode of Object.keys(featureCuts))for(const cut of featureCuts[mode])for(const dir of ['above','below'])for(const data of Object.keys(featureData)){
  const r=featureEvaluate(mode,cut,dir,data);const expected=featureData[data].map(([x,y])=>(((mode==='square'?x*x:x)>cut)===(dir==='above'))===y);assert.deepEqual(r.rows.map(x=>x.correct),expected);assert.equal(r.correct,expected.filter(Boolean).length);
 }
 assert.equal(Math.max(...featureCuts.original.flatMap(c=>['above','below'].map(d=>featureEvaluate('original',c,d,'training').correct))),3);
 assert.equal(featureEvaluate('square',2.5,'above','training').correct,4);assert.equal(featureEvaluate('square',2.5,'above','normal').correct,3);assert.equal(featureEvaluate('square',2.5,'above','changed').correct,0);
 assert.equal(featureMarker('square',2.5,'above','changed',0),'square-changed');assert.equal(featureMarker('square',0,'above','changed',0),null);
});
test('all comparisons and qualified conclusion are required and restoration is defensive',()=>{
 const q=featureCreate();q.seen=[...featureMarkers];q.reflection='limits';assert.equal(featureDone(q),true);const copy=featureRestore(q);copy.seen.pop();assert.equal(q.seen.length,5);assert.throws(()=>featureRestore({...q,cut:2.5}));assert.throws(()=>featureRestore({...q,seen:['square-normal','square-normal']}));
});
