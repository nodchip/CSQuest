import test from 'node:test';
import assert from 'node:assert/strict';
import {pcaThreeRaw,pcaThreeAxes,pcaThreeResult,pcaThreeCreate,pcaThreeDone,pcaThreeRestore} from '../src/pca-three-dimensions.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);

test('centered covariance and eigenvectors agree with direct calculation',()=>{
 const centered=pcaThreeRaw.map(([x,y,z])=>[x-3,y-2,z-1]);
 const scatter=Array.from({length:3},(_,i)=>Array.from({length:3},(_,j)=>centered.reduce((n,p)=>n+p[i]*p[j],0)));
 assert.deepEqual(scatter,[[10,6,0],[6,10,0],[0,0,2]]);
 for(const [key,eigen] of [['major',16],['middle',4],['minor',2]]){
  const v=pcaThreeAxes[key].v;for(let i=0;i<3;i++)near(scatter[i].reduce((n,x,j)=>n+x*v[j],0),eigen*v[i]);
 }
});
test('dropping each direction produces independently calculated reconstruction errors',()=>{
 for(const [drop,error] of [['major',16],['middle',4],['minor',2]]){
  const r=pcaThreeResult(drop);assert.deepEqual(r.mean,[3,2,1]);near(r.error,error);near(r.total,22);near(r.retained,22-error);
  const v=pcaThreeAxes[drop].v;
  for(const row of r.rows){const lost=row.centered.reduce((a,x,i)=>a+x*v[i],0);for(let i=0;i<3;i++)near(row.reconstructed[i],row.raw[i]-lost*v[i]);near(row.error,lost*lost);}
 }
});
test('all comparisons and correct reflection are required and restored values are validated',()=>{
 const q=pcaThreeCreate();q.seen=['major','middle','minor'];q.choice='minor';q.relation='centered';assert.equal(pcaThreeDone(q),false);q.checked=true;assert.equal(pcaThreeDone(q),true);
 const restored=pcaThreeRestore(q);restored.seen.pop();assert.equal(q.seen.length,3);q.seen.push('minor');assert.throws(()=>pcaThreeRestore(q));
});
