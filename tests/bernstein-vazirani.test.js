import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bvCases,bvInputs,bvFunction,bvReplay,bvCreate,bvStep,bvComplete,bvRestore} from '../src/bernstein-vazirani.js';

for(const [id,secret] of Object.entries(bvCases))test(`hidden string ${secret}: two classical responses and one coherent query`,()=>{
 const steps=['left','right','prepare','oracle',`guess:${secret}`,'hadamard'],h=[];
 for(const action of steps){const before=bvReplay(id,h);assert.throws(()=>bvReplay(id,[...h,'wrong']));h.push(action);const s=bvReplay(id,h);assert.equal(s.amplitudes.reduce((a,x)=>a+x*x,0),1);if(action==='oracle'){assert.equal(s.queries,1);assert.deepEqual(s.amplitudes.map(x=>x*x),before.amplitudes.map(x=>x*x));}}
 const s=bvReplay(id,h);assert.equal(s.left,Number(secret[0]));assert.equal(s.right,Number(secret[1]));assert.deepEqual(s.amplitudes,bvInputs.map(x=>x===secret?1:0));assert.equal(s.next,null);assert.equal(bvFunction(secret,'11'),(Number(secret[0])+Number(secret[1]))%2);assert.throws(()=>bvReplay(id,[...h,'hadamard']));
});
test('all cases and reflection are required; restore validates histories',()=>{
 const q=bvCreate();for(const [id,secret] of Object.entries(bvCases)){q.caseId=id;for(const a of ['left','right','prepare','oracle',`guess:${secret}`,'hadamard']){bvStep(q,a);assert.deepEqual(bvRestore(q),q);}}assert(!bvComplete(q));q.answer='promise';assert(bvComplete(q));const bad=structuredClone(q);bad.histories.A[4]='guess:11';assert.throws(()=>bvRestore(bad));
});
