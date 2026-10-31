import test from 'node:test';
import assert from 'node:assert/strict';
import {gramCases,gramFactors,gramResult,createGram,gramCorrect,gramComplete,restoreGram} from '../src/gram-schmidt.js';
test('projection removes precisely the component parallel to u',()=>{
 for(const [id,c] of Object.entries(gramCases)){
  const best=gramResult(id,c.factor);assert.equal(best.dot,0);assert.equal(best.lengthSquared===0,c.type==='dependent');
  assert.equal(c.factor,(c.v[0]*c.u[0]+c.v[1]*c.u[1])/(c.u[0]**2+c.u[1]**2));
  for(const t of gramFactors){const r=gramResult(id,t);assert.equal(r.lengthSquared,best.lengthSquared+(t-c.factor)**2*(c.u[0]**2+c.u[1]**2));}
 }
 assert.throws(()=>gramResult('bad',0));assert.throws(()=>gramResult('east',3));
});
test('completion requires recorded orthogonal residual and correct basis classification',()=>{
 const s=createGram();for(const [id,c] of Object.entries(gramCases)){const t=s.trials[id];t.factor=c.factor;t.attempts=[c.factor];t.type=c.type;t.checked=true;assert.equal(gramCorrect(id,t),true);}assert.equal(gramComplete(s),true);assert.deepEqual(restoreGram(s),s);const copy=restoreGram(s);copy.trials.dependent.type='basis';assert.equal(gramComplete(copy),false);assert.equal(s.trials.dependent.type,'dependent');assert.throws(()=>restoreGram({...s,selected:'bad'}));
});
