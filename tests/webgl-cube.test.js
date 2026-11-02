import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cubeCreate,cubeReady,cubeRecord,cubeComplete,cubeRestore} from '../src/webgl-cube.js';
import {cubePositions,cubeColors,cubeIndices,drawWebglCube} from '../src/webgl-cube-render.js';

test('six faces have four vertices, consistent color and two valid triangles each',()=>{
 assert.equal(cubePositions.length,72);assert.equal(cubeColors.length,72);assert.equal(cubeIndices.length,36);for(let f=0;f<6;f++){for(let j=0;j<6;j++)assert.ok(cubeIndices[6*f+j]>=4*f&&cubeIndices[6*f+j]<4*f+4);for(let j=1;j<4;j++)assert.deepEqual([...cubeColors.slice(12*f,12*f+3)],[...cubeColors.slice(12*f+3*j,12*f+3*j+3)]);}
 assert.equal(drawWebglCube({getContext:()=>null},{shape:'face',angle:0,depth:true}).ok,false);
});
test('all required successful draws, setup and reflection are necessary; saved records are copied',()=>{
 let q=cubeCreate();assert.equal(cubeReady(q),false);assert.throws(()=>cubeRecord(q));for(const k of Object.keys(q.parts))q.parts[k]=true;
 for(const [shape,angle,depth] of [['face',0,true],['solid',0,true],['solid',45,true],['solid',0,false]]){Object.assign(q,{shape,angle,depth});cubeRecord(q);q=cubeRestore(q);}q.answer='order';assert.equal(cubeComplete(q),false);q.answer='depth';assert.equal(cubeComplete(q),true);const copy=cubeRestore(q);copy.observed.pop();assert.equal(cubeComplete(copy),false);assert.equal(cubeComplete(q),true);assert.throws(()=>cubeRestore({...q,observed:['solid:99:on']}));
});
