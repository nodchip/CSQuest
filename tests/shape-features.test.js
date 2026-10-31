import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shapeSamples,shapeFeature,shapeFeatureWorks,createShapeFeature,shapeFeatureComplete,restoreShapeFeature} from '../src/shape-features.js';
test('four-pixel objects need shape-sensitive and translation-invariant features for these examples',()=>{
 assert.deepEqual(Object.values(shapeSamples).map(s=>shapeFeature('area',s)),['4','4','4']);assert.notEqual(shapeFeature('position',shapeSamples.A),shapeFeature('position',shapeSamples.B));assert.deepEqual(Object.values(shapeSamples).map(s=>shapeFeature('bounds',s)),['幅2・高さ2','幅2・高さ2','幅4・高さ1']);assert.deepEqual(['area','position','bounds'].filter(shapeFeatureWorks),['bounds']);assert.throws(()=>shapeFeature('area',[0,0]),RangeError);
});
test('all features must be tried, valid state is copied, and wrong decisions fail',()=>{
 const s=createShapeFeature();for(const k of ['area','position','bounds'])s.tested[k]=true;s.choice='bounds';s.checked=true;const copy=restoreShapeFeature(s);s.tested.area=false;assert.equal(shapeFeatureComplete(copy),true);assert.equal(shapeFeatureComplete(s),false);copy.choice='position';assert.equal(shapeFeatureComplete(copy),false);assert.throws(()=>restoreShapeFeature({...copy,selected:'bad'}),RangeError);
});
