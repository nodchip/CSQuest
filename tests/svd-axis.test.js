import test from 'node:test';
import assert from 'node:assert/strict';
import {svdCases,svdVectors,svdApply,createSvd,svdCorrect,svdComplete,restoreSvd} from '../src/svd-axis.js';
test('axis vectors diagonalize A transpose A and have the stated singular lengths',()=>{
 for(const [id,c] of Object.entries(svdCases)){
  const a=svdApply(id,'x'),b=svdApply(id,'y'),d=svdApply(id,'diagonal');
  assert.equal(a.length,c.singular[0]);assert.equal(b.length,c.singular[1]);assert.equal(a.output[0]*b.output[0]+a.output[1]*b.output[1],0);
  assert.ok(Math.abs(d.length**2-(a.length**2+b.length**2)/2)<1e-12);
  for(let i=0;i<360;i++){const theta=i*Math.PI/180,v=[Math.cos(theta),Math.sin(theta)],out=c.matrix.map(row=>row[0]*v[0]+row[1]*v[1]),length=Math.hypot(...out);assert.ok(length<=c.singular[0]+1e-12&&length>=c.singular[1]-1e-12);}
 }
 assert.deepEqual(svdApply('flat','y').output,[0,0]);assert.throws(()=>svdApply('bad','x'));
});
test('the trials require all directions, ordered values and the correct explanation',()=>{
 const s=createSvd();for(const [id,c] of Object.entries(svdCases)){const t=s.trials[id];t.seen=Object.keys(svdVectors);[t.large,t.small]=c.singular;t.reason='eigen';t.checked=true;assert.equal(svdCorrect(id,t),false);t.reason='gram';assert.equal(svdCorrect(id,t),true);}
 assert.equal(svdComplete(s),true);assert.deepEqual(restoreSvd(s),s);const copy=restoreSvd(s);copy.trials.flat.seen.pop();assert.equal(svdComplete(copy),false);assert.equal(s.trials.flat.seen.length,3);assert.throws(()=>restoreSvd({...s,selected:'bad'}));
});
