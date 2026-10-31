import test from 'node:test';
import assert from 'node:assert/strict';
import {inTriangle,centerPixels,edgeSamples,rasterCorrect,createRaster,restoreRaster,rasterComplete} from '../src/raster.js';

test('center samples match the independently enumerated grid',()=>{
  assert.deepEqual(centerPixels(),[0,1,2,3,5,6,7,10,11,15]);
  assert.deepEqual(edgeSamples(),[0]);
  assert.equal(inTriangle(4.5,0.5),false);assert.equal(inTriangle(4.25,0.25),true);
});
test('each omitted or extra mark fails and both stages must be checked',()=>{
  const state=createRaster();for(const [kind,expected,limit] of [['pixels',centerPixels(),25],['samples',edgeSamples(),4]]){
    assert.equal(rasterCorrect(kind,expected),true);
    for(let i=0;i<limit;i++){const changed=expected.includes(i)?expected.filter(x=>x!==i):[...expected,i];assert.equal(rasterCorrect(kind,changed),false);}
    state.choices[kind]={items:expected,checked:true};
  }assert.equal(rasterComplete(state),true);state.choices.samples.checked=false;assert.equal(rasterComplete(state),false);
});
test('saved selections are copied and malformed coordinates rejected',()=>{
  const state=createRaster();state.choices.pixels.items=[0,1];const restored=restoreRaster(state);state.choices.pixels.items.push(2);assert.deepEqual(restored.choices.pixels.items,[0,1]);
  state.choices.samples.items=[0,0];assert.throws(()=>restoreRaster(state),RangeError);
  state.choices.samples.items=[4];assert.throws(()=>restoreRaster(state),RangeError);
});
