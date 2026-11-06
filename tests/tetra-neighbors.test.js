import {test} from 'node:test';
import assert from 'node:assert/strict';
import {neighborMesh,neighborCreate,neighborSetMask,neighborToggle,neighborCheck,neighborRestore} from '../src/tetra-neighbors.js';

test('all 32 sign patterns agree on shared face intersections and reuse global edge vertices',()=>{
 for(let mask=0;mask<32;mask++){
  const mesh=neighborMesh(mask),[a,b]=mesh.pieces,common=a.crossings.filter(k=>b.crossings.includes(k)).sort();
  const sharedEdges=['0:1','0:2','1:2'].filter(key=>{const [x,y]=key.split(':').map(Number);return Boolean(mask&(1<<x))!==Boolean(mask&(1<<y));});
  assert.deepEqual(common,sharedEdges);assert.equal(common.length===0||common.length===2,true);
  assert.equal(mesh.vertices.length,a.crossings.length+b.crossings.length-common.length);
  for(const piece of mesh.pieces)for(const triangle of piece.triangles){assert.equal(new Set(triangle).size,3);for(const key of triangle)assert(piece.crossings.includes(key));}
 }
 assert.throws(()=>neighborMesh(32));
});
test('empty and nonempty shared faces can be retried and restored',()=>{
 const s=neighborCreate();assert.equal(neighborCheck(s),false);
 for(const i of [0,1])neighborToggle(s,i);assert.equal(neighborCheck(s),true);
 neighborSetMask(s,0);assert.equal(neighborCheck(s),true);
 const copy=neighborRestore(s);copy.checked.pop();assert.equal(s.checked.length,2);
 assert.throws(()=>neighborRestore({...s,selected:[1,1]}));assert.throws(()=>neighborRestore({...s,checked:[32]}));
});
