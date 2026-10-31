import test from 'node:test';
import assert from 'node:assert/strict';
import {basisSets,basisCases,basisValues,basisPoint,createBasis,basisChoiceCorrect,basisCorrect,basisComplete,restoreBasis} from '../src/basis-coordinates.js';
test('both basis maps yield unique coordinates for each target',()=>{
 for(const [id,task] of Object.entries(basisCases))for(const key of Object.keys(basisSets)){
  const hits=[];for(const a of basisValues)for(const b of basisValues)if(basisChoiceCorrect(id,key,{a,b}))hits.push([a,b]);assert.equal(hits.length,1);assert.deepEqual(basisPoint(key,...hits[0]),task.target);
  if(key==='slant')assert.deepEqual(hits[0],[task.target[0]-task.target[1],task.target[1]]);
 }
 for(const item of Object.values(basisSets)){const [u,v]=item.vectors;assert.notEqual(u[0]*v[1]-u[1]*v[0],0);}
 assert.throws(()=>basisPoint('bad',0,0));assert.throws(()=>basisPoint('standard',3,0));
});
test('both checked maps and the same-position explanation are required',()=>{
 const s=createBasis();for(const [id,task] of Object.entries(basisCases)){const t=s.trials[id];t.choices.standard={a:task.target[0],b:task.target[1],checked:true};t.choices.slant={a:task.target[0]-task.target[1],b:task.target[1],checked:true};t.reason='move';t.checked=true;assert.equal(basisCorrect(id,t),false);t.reason='same';assert.equal(basisCorrect(id,t),true);}assert.equal(basisComplete(s),true);assert.deepEqual(restoreBasis(s),s);const copy=restoreBasis(s);copy.trials.star.choices.slant.a=0;assert.equal(basisComplete(copy),false);assert.equal(s.trials.star.choices.slant.a,-1);assert.throws(()=>restoreBasis({...s,selected:'bad'}));
});
