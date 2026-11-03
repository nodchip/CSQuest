import test from 'node:test';
import assert from 'node:assert/strict';
import {coalescedPatterns,coalescedEvaluate,coalescedMarker,coalescedCreate,coalescedRestore,coalescedDone} from '../src/coalesced-load.js';
test('named arrangements have independently calculated sectors and distinct byte counts',()=>{
 const expected={packed:[[0],32,16],reverse:[[0],32,16],cross:[[0,1],64,16],stride:[[0,1,2,3],128,16],shared:[[0],32,4]};
 for(const [k,p] of Object.entries(coalescedPatterns)){const r=coalescedEvaluate(p.indices),e=expected[k];assert.deepEqual(r.sectors,e[0]);assert.equal(r.transactions,e[0].length);assert.equal(r.transferred,e[1]);assert.equal(r.uniqueBytes,e[2]);assert.equal(coalescedMarker(p.indices),k);}
 assert.throws(()=>coalescedEvaluate([0,1,2,32]));assert.throws(()=>coalescedEvaluate([0,1,2]));
});
test('all representative combinations and lane permutations preserve the accessed sector set',()=>{
 for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++)for(let d=0;d<4;d++){
  const indices=[a*8,b*8+1,c*8+2,d*8+3],r=coalescedEvaluate(indices);assert.equal(r.transactions,new Set([a,b,c,d]).size);assert.equal(r.uniqueBytes,16);assert.deepEqual(coalescedEvaluate([...indices].reverse()).sectors,r.sectors);
 }
});
test('completion and restoration require valid unique observations and both reflections',()=>{
 const q=coalescedCreate();q.seen=Object.keys(coalescedPatterns);q.reflection='same';q.limits='measure';assert.equal(coalescedDone(q),true);for(const k of q.seen)assert.equal(coalescedDone({...q,seen:q.seen.filter(x=>x!==k)}),false);assert.equal(coalescedDone({...q,limits:'guarantee'}),false);assert.equal(coalescedDone({...q,reflection:'sequential'}),false);
 const r=coalescedRestore(q);r.indices[0]=3;r.seen.pop();assert.equal(q.indices[0],0);assert.equal(q.seen.length,5);assert.throws(()=>coalescedRestore({...q,seen:['shared','shared']}));assert.throws(()=>coalescedRestore({...q,indices:[0,1,2,32]}));
});
