import test from 'node:test';
import assert from 'node:assert/strict';
import {heteroCases,heteroModes,heteroReplay,heteroCreate,heteroRestore,heteroComplete} from '../src/heterogeneous-memory.js';

test('copies and migration follow the fixed workloads and preserve current values',()=>{
 const expected={grouped:{explicit:[2,3],shared:[2,3]},alternating:{explicit:[2,2],shared:[3,2]}};
 for(const s of Object.keys(heteroCases))for(const m of Object.keys(heteroModes)){
  const actions=[];let r=heteroReplay(s,m,actions);
  while(!r.done){if(r.needsCopy){assert.throws(()=>heteroReplay(s,m,[...actions,'step']));actions.push('copy');}actions.push('step');r=heteroReplay(s,m,actions);}
  assert.deepEqual([r.moves,r.read],expected[s][m]);assert.equal(r.latest,'gpu');assert.equal(r.gpu,3);
  assert.throws(()=>heteroReplay(s,m,[...actions,'step']));
 }
});
test('partial trials restore and completion needs four finished trials and a correct reflection',()=>{
 const q=heteroCreate();q.trials.grouped.explicit=['step','copy','step'];assert.deepEqual(heteroRestore(q),q);assert.throws(()=>heteroRestore({...q,trials:{...q.trials,grouped:{...q.trials.grouped,explicit:['copy']}}}));
 for(const s of Object.keys(heteroCases))for(const m of Object.keys(heteroModes)){const actions=q.trials[s][m];while(!heteroReplay(s,m,actions).done){const r=heteroReplay(s,m,actions);if(r.needsCopy)actions.push('copy');actions.push('step');}}
 assert.equal(heteroComplete(q),false);q.answer='depends';assert.equal(heteroComplete(q),true);
});
