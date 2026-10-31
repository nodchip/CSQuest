import test from 'node:test';
import assert from 'node:assert/strict';
import {layerAddresses,createLayers,stepLayers,restoreLayers} from '../src/layers.js';

const first=()=>stepLayers(stepLayers(createLayers(),'transport'),'network');
const setPair=(s,a,b)=>stepLayers(stepLayers(s,`source:${a}`),`destination:${b}`);
test('each hop requires its own outgoing and next-hop addresses',()=>{
  for(const [phase,expected] of [['first',['S','W']],['second',['E','D']]]){
    let base=first();if(phase==='second')base=stepLayers(setPair(base,'S','W'),'send');
    for(const source of Object.keys(layerAddresses))for(const destination of Object.keys(layerAddresses)){
      const before=setPair(base,source,destination),after=stepLayers(before,'send');
      assert.equal(after.phase!==phase,source===expected[0]&&destination===expected[1]);
    }
  }
});
test('the layers are built and removed in order and each invalid operation does not advance',()=>{
  let s=createLayers();assert.equal(stepLayers(s,'network').phase,'transport');
  for(const action of ['transport','network','source:S','destination:W','send','source:E','destination:D','send','link','networkOpen','transportOpen','deliver'])s=stepLayers(s,action);
  assert.equal(s.phase,'done');assert.deepEqual(restoreLayers(s.history),s);assert.throws(()=>stepLayers(s,'deliver'),RangeError);
});
test('restoration rejects impossible or unsuccessful transitions',()=>{
  assert.throws(()=>restoreLayers(['network']),RangeError);
  assert.throws(()=>restoreLayers(['transport','network','source:S','destination:D','send']),RangeError);
  assert.throws(()=>restoreLayers(['source:S']),RangeError);
});
