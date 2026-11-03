import test from 'node:test';
import assert from 'node:assert/strict';
import {probabilityAxiomsValidCounts,probabilityAxiomsMeasure,probabilityAxiomsCompare,probabilityAxiomsObserved,probabilityAxiomsCreate,probabilityAxiomsRestore,probabilityAxiomsDone} from '../src/probability-axioms-lab.js';
test('finite distributions obey nonnegativity, normalization and union identities',()=>{
 let distributions=0;for(let red=0;red<=6;red++)for(let blue=0;blue<=6-red;blue++){const counts=[red,blue,6-red-blue];distributions++;assert.equal(probabilityAxiomsMeasure(counts,0),0);assert.equal(probabilityAxiomsMeasure(counts,7),6);
  for(let a=0;a<8;a++)for(let b=0;b<8;b++){const r=probabilityAxiomsCompare(counts,a,b);assert.ok(r.a>=0&&r.a<=6);assert.equal(r.union,r.sum-r.intersection);if(r.disjoint)assert.equal(r.union,r.sum);}
 }assert.equal(distributions,28);assert.equal(probabilityAxiomsValidCounts([2,2,3]),false);assert.throws(()=>probabilityAxiomsMeasure([2,2,2],8));
});
test('overlap counts shared colors once, and completion needs both distributions',()=>{
 const q=probabilityAxiomsCreate();q.a=3;q.b=6;assert.deepEqual(probabilityAxiomsCompare(q.counts,q.a,q.b),{a:4,b:4,intersection:2,union:6,sum:8,disjoint:false});assert.deepEqual(probabilityAxiomsObserved(q),['overlap']);
 q.counts=[3,2,1];assert.deepEqual(probabilityAxiomsObserved(q),['changed']);q.seen=['empty','whole','disjoint','overlap','changed'];q.axioms='valid';q.unionAnswer='subtract';assert.equal(probabilityAxiomsDone(q),true);
 const copy=probabilityAxiomsRestore(q);copy.counts[0]=0;assert.equal(q.counts[0],3);assert.throws(()=>probabilityAxiomsRestore({...q,seen:['empty','empty']}));
});
