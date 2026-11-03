import test from 'node:test';
import assert from 'node:assert/strict';
import {vectorAngle,angleMarkers,vectorAngleCreate,vectorAngleRestore,vectorAngleDone} from '../src/vector-angle-lab.js';
test('all 625 integer vector pairs agree with dot, norm, angle and distribution',()=>{
 const seen=new Set();
 for(let ax=-2;ax<=2;ax++)for(let ay=-2;ay<=2;ay++)for(let bx=-2;bx<=2;bx++)for(let by=-2;by<=2;by++)for(let k=-2;k<=2;k++){
  const a=[ax,ay],b=[bx,by],r=vectorAngle(a,b,k);seen.add(r.type);assert.equal(r.dot,ax*bx+ay*by);assert.deepEqual(r.sum,[ax+bx,ay+by]);assert.deepEqual(r.scaledSum,r.parts);
  if(r.angle!==null){const cosine=Math.max(-1,Math.min(1,r.dot/(Math.hypot(ax,ay)*Math.hypot(bx,by))));assert.ok(Math.abs(r.angle-Math.acos(cosine)*180/Math.PI)<2e-6);assert.ok(r.angle>=0&&r.angle<=180);}else assert.ok((ax===0&&ay===0)||(bx===0&&by===0));
 }assert.deepEqual([...seen].sort(),[...angleMarkers].sort());
});
test('every angle class and the zero-vector limitation are required; saved values are copied',()=>{
 const q=vectorAngleCreate();q.seen=[...angleMarkers];q.reflection='undefined';assert.equal(vectorAngleDone(q),true);const copy=vectorAngleRestore(q);copy.a[0]=2;assert.equal(q.a[0],1);assert.throws(()=>vectorAngleRestore({...q,a:[3,0]}));assert.throws(()=>vectorAngleRestore({...q,seen:['zero','zero']}));
});
