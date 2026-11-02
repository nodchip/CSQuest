import {test} from 'node:test';
import assert from 'node:assert/strict';
import {simonCases,simonBits,simonDot,simonDistribution,simonCandidates,simonReplay,simonCreate,simonStep,simonComplete,simonRestore} from '../src/simon-period.js';

test('every nonzero three-bit period produces a uniform orthogonal distribution',()=>{
 for(const s of simonBits.filter(x=>x!=='000')){const dist=simonDistribution(s);assert.equal(Object.values(dist).reduce((a,b)=>a+b,0),1);for(const y of simonBits)assert.equal(dist[y],simonDot(s,y)===0?.25:0);}
 assert.equal(simonCandidates(['000']).length,7);
});
for(const [id,{secret,samples}] of Object.entries(simonCases))test(`${id}: zero, independent samples, and secret`,()=>{
 const h=[];const steps=[`sample:${samples[0]}`,'judge:none',`sample:${samples[1]}`,'judge:partial',`sample:${samples[2]}`,'judge:unique',`guess:${secret}`];
 for(const a of steps){assert.throws(()=>simonReplay(id,[...h,'wrong']));h.push(a);const s=simonReplay(id,h);assert(s.candidates.includes(secret));if(s.seen.length===1)assert.equal(s.candidates.length,7);if(s.seen.length===2)assert.equal(s.candidates.length,3);if(s.seen.length===3)assert.deepEqual(s.candidates,[secret]);}assert.equal(simonReplay(id,h).next,null);assert.throws(()=>simonReplay(id,[...h,'wrong']));
});
test('all cases and reflection required and saved histories validated',()=>{const q=simonCreate();for(const [id,{secret,samples}] of Object.entries(simonCases)){q.caseId=id;for(const a of [`sample:${samples[0]}`,'judge:none',`sample:${samples[1]}`,'judge:partial',`sample:${samples[2]}`,'judge:unique',`guess:${secret}`]){simonStep(q,a);assert.deepEqual(simonRestore(q),q);}}assert(!simonComplete(q));q.answer='independent';assert(simonComplete(q));const bad=structuredClone(q);bad.histories.A[1]='judge:unique';assert.throws(()=>simonRestore(bad));});
