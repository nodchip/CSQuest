import test from 'node:test';
import assert from 'node:assert/strict';
import {aesSbox,differentialRow,differentialCandidates,differentialExperiment,differentialInputs,createAesDifferential,aesDifferentialComplete,restoreAesDifferential} from '../src/aes-differential.js';
test('AES S-box matches known FIPS values and is a permutation',()=>{
 assert.deepEqual(aesSbox.slice(0,16),[0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76]);
 assert.equal(aesSbox[0x53],0xed);assert.equal(aesSbox[0xff],0x16);assert.equal(new Set(aesSbox).size,256);
});
test('every nonzero input difference has 129 zero, 126 two and one four counts',()=>{
 for(let dx=1;dx<256;dx++){const row=differentialRow(dx);assert.equal(row.reduce((a,b)=>a+b,0),256);assert.equal(row.filter(n=>n===0).length,129);assert.equal(row.filter(n=>n===2).length,126);assert.equal(row.filter(n=>n===4).length,1);}
 const zero=differentialRow(0);assert.equal(zero[0],256);assert.equal(zero.slice(1).every(n=>n===0),true);
});
test('displayed pairs and required observations match computed counts',()=>{
 for(const dx of differentialInputs)for(const dy of differentialCandidates(dx)){const r=differentialExperiment(dx,dy);assert.equal(r.count,differentialRow(dx)[dy]);for(const p of r.matches)assert.equal(p.left^p.right,dy);}
 const s=createAesDifferential();s.tested=differentialInputs.flatMap(dx=>differentialCandidates(dx).filter(dy=>dx!==0||dy===0).map(dy=>`${dx}:${dy}`));s.answer='limited';s.checked=true;assert.ok(aesDifferentialComplete(restoreAesDifferential(s)));
 assert.throws(()=>restoreAesDifferential({...s,tested:['1:999']}));
});
