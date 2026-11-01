import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderPipelineScene,pipelineRequired,createRenderPipeline,renderPipelineComplete,restoreRenderPipeline} from '../src/render-pipeline.js';

test('各段階の値と深度あり・なしの窓を検証する',()=>{
 const base=renderPipelineScene(0,0,'on');assert.deepEqual(base.pixels,['空','朱','空']);
 const on=renderPipelineScene(-1,1,'on'),off=renderPipelineScene(-1,1,'off');
 assert.deepEqual(on.banners[0].world,[-2,0]);assert.deepEqual(on.banners[0].view,[-3,-1]);assert.deepEqual(on.banners[0].projected,[-1.5,-0.5]);assert.deepEqual(on.banners[0].clipped,[-1,-0.5]);
 assert.deepEqual(on.fragments.map(fs=>fs.map(f=>f.id)),[['A','B'],['B'],[]]);assert.deepEqual(on.pixels,['朱','青','空']);assert.deepEqual(off.pixels,['青','青','空']);
});
test('すべての設定で投影した候補と独立した逆算が一致する',()=>{
 const xs=[-2/3,0,2/3];for(const shift of [-1,0,1])for(const camera of [0,1])for(const depth of ['on','off']){
  const scene=renderPipelineScene(shift,camera,depth);
  for(const [i,x] of xs.entries()){
   const a=x*2+camera-shift,b=x*4+camera;const names=[...(a>=-1&&a<=1?['A']:[]),...(b>=-2&&b<=2?['B']:[])];
   assert.deepEqual(scene.fragments[i].map(f=>f.id),names);assert.equal(scene.pixels[i],names.length?(depth==='on'?names[0]:names.at(-1))==='A'?'朱':'青':'空');
  }
 }
 assert.throws(()=>renderPipelineScene(2,0,'on'),RangeError);
});
test('３観察と振り返りが必要で、途中状態を検証して復元する',()=>{
 const s=createRenderPipeline();s.observed=[...pipelineRequired];s.answer='order';assert.equal(renderPipelineComplete(s),false);s.checked=true;assert.equal(renderPipelineComplete(s),true);
 const restored=restoreRenderPipeline(s);restored.observed.pop();assert.equal(s.observed.length,3);
 for(const p of [{stage:6},{camera:2},{observed:['1,2,on']},{observed:['0,0,on','0,0,on']},{answer:'bad'},{checked:1}])assert.throws(()=>restoreRenderPipeline({...s,...p}),RangeError);
});
