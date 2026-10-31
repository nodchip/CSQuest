import test from 'node:test';
import assert from 'node:assert/strict';
import {projectionPoints,projectionCases,projectionOptions,projectX,projectionResult,createProjection,restoreProjection,projectionComplete} from '../src/projection.js';
test('perspective uses similar triangles and parallel projection preserves horizontal position',()=>{
  for(const x of [-8,0,8])for(const z of [2,4,8])for(const f of [1,2]){assert.equal(projectX({x,z},{type:'perspective',f})*z,f*x);assert.equal(projectX({x,z},{type:'parallel',f}),x);}
  assert.throws(()=>projectX({x:1,z:0},{type:'perspective',f:1}),RangeError);
});
test('all selectable pairs are evaluated independently for both lights',()=>{
  for(const [id,mode] of Object.entries(projectionCases))for(const near of projectionOptions)for(const far of projectionOptions){const r=projectionResult(id,{near,far});assert.equal(r.near,near===projectX(projectionPoints.near,mode));assert.equal(r.far,far===projectX(projectionPoints.far,mode));}
});
test('all examples require checked correct choices and saved inputs are validated',()=>{
  const s=createProjection();for(const [id,mode] of Object.entries(projectionCases))s.choices[id]={near:projectX(projectionPoints.near,mode),far:projectX(projectionPoints.far,mode),checked:true};assert.equal(projectionComplete(restoreProjection(s)),true);
  s.choices.wide.checked=false;assert.equal(projectionComplete(s),false);assert.throws(()=>restoreProjection({...s,choices:{...s.choices,wide:{near:9,far:null,checked:false}}}),RangeError);
});
