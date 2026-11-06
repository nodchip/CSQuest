import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tetraEdges,tetraVertices,tetraCrossings,tetraMesh,tetraCreate,tetraSetMask,tetraToggleEdge,tetraCheck,tetraCorrect,tetraRestore} from '../src/tetra-surface.js';

test('all 16 configurations give a consistent planar triangle or quadrilateral',()=>{
 for(let mask=0;mask<16;mask++){
  const mesh=tetraMesh(mask),positive=Array.from({length:4},(_,i)=>Boolean(mask&(1<<i))).filter(Boolean).length;
  assert.equal(mesh.crossings.length,positive*(4-positive));
  assert.equal(mesh.triangles.length,positive===0||positive===4?0:positive===2?2:1);
  assert.deepEqual(mesh.crossings,tetraCrossings(15-mask));
  for(const [j,edge] of mesh.crossings.entries()){
   const [a,b]=tetraEdges[edge];assert.notEqual(Boolean(mask&(1<<a)),Boolean(mask&(1<<b)));
   assert.deepEqual(mesh.points[j],tetraVertices[a].map((n,k)=>(n+tetraVertices[b][k])/2));
  }
  for(const triangle of mesh.triangles){assert.equal(new Set(triangle).size,3);for(const e of triangle)assert(mesh.crossings.includes(e));}
  if(mesh.triangles.length===2){const [a,b]=mesh.triangles;assert.equal(a.filter(x=>b.includes(x)).length,2);assert.equal(new Set([...a,...b]).size,4);}
 }
 assert.throws(()=>tetraMesh(16));
});

test('wrong and empty selections, retries and independent restored state',()=>{
 const s=tetraCreate();assert.equal(tetraCheck(s),false);
 for(const e of tetraCrossings(1))tetraToggleEdge(s,e);
 assert.equal(tetraCheck(s),true);assert(tetraCorrect(s));
 tetraSetMask(s,0);assert.equal(tetraCheck(s),true);
 tetraSetMask(s,3);for(const e of tetraCrossings(3))tetraToggleEdge(s,e);assert.equal(tetraCheck(s),true);
 const copy=tetraRestore(s);copy.checked.pop();assert.equal(s.checked.length,3);
 assert.throws(()=>tetraRestore({...s,selected:[0,0]}));assert.throws(()=>tetraRestore({...s,checked:[-1]}));
});
