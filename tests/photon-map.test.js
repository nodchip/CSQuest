import test from 'node:test';
import assert from 'node:assert/strict';
import {photonPaths,photonEstimate,photonCreate,photonEmit,photonInspect,photonRestore,photonComplete} from '../src/photon-map.js';
test('radius queries count surface hits including the boundary, excluding the absorbed path',()=>{
 const all=Object.keys(photonPaths);for(const point of ['P','Q'])for(const radius of [1,2]){const r=photonEstimate(all,point,radius);assert.equal(r.hits.length,radius===1?4:5);assert.equal(r.density,r.hits.length/(Math.PI*radius*radius));assert.ok(!r.hits.includes('F'));}
 assert.deepEqual(photonEstimate(all,'P',1).hits,['A','B','C','E']);assert.deepEqual(photonEstimate(all,'Q',1).hits,['A','B','C','D']);assert.throws(()=>photonEstimate(['A','A'],'P',1));
});
test('building the map precedes querying, drafts restore, and comparisons are required',()=>{
 const q=photonCreate();photonEmit(q,'A');assert.throws(()=>photonInspect(q));assert.deepEqual(photonRestore(q),q);assert.throws(()=>photonEmit(q,'A'));
 for(const id of ['B','C','D','E','F'])photonEmit(q,id);for(const point of ['P','Q'])for(const radius of [1,2]){q.point=point;q.radius=radius;photonInspect(q);}q.method='passes';assert.equal(photonComplete(q),false);q.limits='area';assert.equal(photonComplete(q),true);
});
