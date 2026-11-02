import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allocationCases,allocationPairs,allocationCheck,allocationCreate,allocationAssign,allocationVerify,allocationComplete,allocationRestore,allocationTogglePair,allocationGraphCheck,allocationGraphVerify} from '../src/register-allocation.js';

test('all placements are compared with independent overlap and minimum-spill conditions',()=>{
 const edges={chain:[[0,1],[1,2],[2,3]],triangle:[[0,1],[1,2],[0,2],[2,3]]};
 for(const [id,es] of Object.entries(edges)){let minimum=4;const candidates=[];
  for(let code=0;code<81;code++){let n=code;const p=[];for(let i=0;i<4;i++){p.push(['r1','r2','spill'][n%3]);n=Math.floor(n/3);}const valid=es.every(([a,b])=>p[a]==='spill'||p[b]==='spill'||p[a]!==p[b]);if(valid)minimum=Math.min(minimum,p.filter(x=>x==='spill').length);candidates.push({p,valid});}
  assert.equal(minimum,id==='chain'?0:1);for(const {p,valid} of candidates)assert.equal(allocationCheck(id,p).ok,valid&&p.filter(x=>x==='spill').length===minimum);
 }
 assert.equal(allocationCheck('chain',[null,null,null,null]).reason,'missing');
});
test('both cases, minimal valid layouts, reflection, changes and restored records are checked',()=>{
 const q=allocationCreate();for(const [id,values] of Object.entries({chain:['r1','r2','r1','r2'],triangle:['r1','r2','spill','r1']})){q.selected=id;values.forEach((v,i)=>allocationAssign(q,i,v));assert.equal(allocationVerify(q).ok,true);for(const [a,b] of allocationCases[id].edges)allocationTogglePair(q,allocationPairs.findIndex(([x,y])=>x===a&&y===b));assert.equal(allocationGraphVerify(q),true);assert.deepEqual(allocationRestore(q),q);}
 assert.equal(allocationComplete(q),false);q.answer='live';assert.equal(allocationComplete(q),true);allocationAssign(q,2,'r1');assert.equal(allocationComplete(q),false);assert.equal(allocationVerify(q).reason,'conflict');
 const bad=structuredClone(q);bad.trials.triangle.verified=true;assert.throws(()=>allocationRestore(bad));
});
test('live snapshots determine every overlap and old drafts keep their placements',()=>{
 const expected={chain:[0,3,5],triangle:[0,1,3,5]};
 for(const id of Object.keys(expected)){const es=allocationCases[id].edges.map(([a,b])=>allocationPairs.findIndex(([x,y])=>x===a&&y===b)).sort();assert.deepEqual(es,expected[id]);for(let mask=0;mask<64;mask++){const p=allocationPairs.map((_,i)=>i).filter(i=>mask&(1<<i));assert.equal(allocationGraphCheck(id,p),p.length===expected[id].length&&p.every(i=>expected[id].includes(i)));}}
 const old=allocationCreate();for(const t of Object.values(old.trials)){delete t.pairs;delete t.graphVerified;}old.trials.chain.placements[0]='r1';const restored=allocationRestore(old);assert.equal(restored.trials.chain.placements[0],'r1');assert.deepEqual(restored.trials.chain.pairs,[]);assert.equal(restored.trials.chain.graphVerified,false);
 const forged=allocationCreate();forged.trials.chain.graphVerified=true;assert.throws(()=>allocationRestore(forged));
});
