import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allocationCases,allocationPairs,allocationCheck,allocationCreate,allocationAssign,allocationVerify,allocationComplete,allocationRestore,allocationTogglePair,allocationGraphCheck,allocationGraphVerify,allocationLiveness,allocationLiveCheck,allocationLiveToggle,allocationLiveVerify,allocationLiveUpdate} from '../src/register-allocation.js';

test('all placements are compared with independent overlap and minimum-spill conditions',()=>{
 const edges={chain:[[0,1],[1,2],[2,3]],triangle:[[0,1],[1,2],[0,2],[2,3]],loop:[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]};
 for(const [id,es] of Object.entries(edges)){let minimum=4;const candidates=[];
  for(let code=0;code<81;code++){let n=code;const p=[];for(let i=0;i<4;i++){p.push(['r1','r2','spill'][n%3]);n=Math.floor(n/3);}const valid=es.every(([a,b])=>p[a]==='spill'||p[b]==='spill'||p[a]!==p[b]);if(valid)minimum=Math.min(minimum,p.filter(x=>x==='spill').length);candidates.push({p,valid});}
  assert.equal(minimum,{chain:0,triangle:1,loop:2}[id]);for(const {p,valid} of candidates)assert.equal(allocationCheck(id,p).ok,valid&&p.filter(x=>x==='spill').length===minimum);
 }
 assert.equal(allocationCheck('chain',[null,null,null,null]).reason,'missing');
});
test('all cases, minimal valid layouts, reflection, changes and restored records are checked',()=>{
 const q=allocationCreate();for(const [id,values] of Object.entries({chain:['r1','r2','r1','r2'],triangle:['r1','r2','spill','r1'],loop:['r1','r2','spill','spill']})){q.selected=id;values.forEach((v,i)=>allocationAssign(q,i,v));assert.equal(allocationVerify(q).ok,true);allocationCases[id].live.forEach((r,i)=>r.forEach(v=>allocationLiveToggle(q,i,v)));assert.equal(allocationLiveVerify(q),true);for(const [a,b] of allocationCases[id].edges)allocationTogglePair(q,allocationPairs.findIndex(([x,y])=>x===a&&y===b));assert.equal(allocationGraphVerify(q),true);assert.deepEqual(allocationRestore(q),q);}
 assert.equal(allocationComplete(q),false);q.answer='live';assert.equal(allocationComplete(q),true);allocationAssign(q,2,'r1');assert.equal(allocationComplete(q),false);assert.equal(allocationVerify(q).reason,'conflict');
 const bad=structuredClone(q);bad.trials.loop.verified=true;assert.throws(()=>allocationRestore(bad));
});
test('backward liveness agrees with hand-derived sets and rejects all other selections',()=>{
 const expected={chain:[[0,1],[1,2],[2,3]],triangle:[[0,1,2],[2,3]],loop:[[0,2,3],[0,1,2,3],[2,3]]};
 for(const [id,rows] of Object.entries(expected)){assert.deepEqual(allocationLiveness(id),rows);assert.deepEqual(allocationCases[id].live,rows);const variants=2**(rows.length*4);for(let mask=0;mask<variants;mask++){const chosen=rows.map((_,row)=>[0,1,2,3].filter(v=>mask&(1<<(row*4+v))));const same=chosen.every((r,i)=>r.length===rows[i].length&&r.every(v=>rows[i].includes(v)));assert.equal(allocationLiveCheck(id,chosen),same);}}
 const old=allocationCreate();delete old.trials.loop;for(const t of Object.values(old.trials)){delete t.liveRows;delete t.liveVerified;}old.trials.chain.placements[0]='r1';const restored=allocationRestore(old);assert.equal(restored.trials.chain.placements[0],'r1');assert.equal(restored.trials.chain.liveVerified,false);assert.deepEqual(restored.trials.chain.liveRows,[[],[],[]]);assert.deepEqual(restored.trials.loop.liveRows,[[],[],[]]);
 const bad=allocationCreate();bad.trials.chain.liveVerified=true;assert.throws(()=>allocationRestore(bad));
});
test('each live value has a path to a use before any overwrite',()=>{
 for(const id of Object.keys(allocationCases)){const steps=allocationCases[id].steps,expected=steps.map((_,start)=>[0,1,2,3].filter(value=>{const todo=[start],visited=new Set();while(todo.length){const i=todo.pop();if(visited.has(i))continue;visited.add(i);const step=steps[i];if(step.use.includes(value))return true;if(!step.def.includes(value))todo.push(...step.next);}return false;}));assert.deepEqual(allocationLiveness(id),expected);}
});
test('all reachable update orders from empty stabilize at the same live sets',()=>{
 for(const id of Object.keys(allocationCases)){const initial=allocationCreate();initial.selected=id;const start=initial.trials[id].liveRows,seen=new Set([JSON.stringify(start)]),todo=[start];let terminals=0;
  while(todo.length){const rows=todo.pop();let stable=true;for(let row=0;row<rows.length;row++){const q=allocationCreate();q.selected=id;q.trials[id].liveRows=rows.map(r=>[...r]);const result=allocationLiveUpdate(q,row);if(result.changed){stable=false;const next=q.trials[id].liveRows,key=JSON.stringify(next);if(!seen.has(key)){seen.add(key);todo.push(next);}}}
   if(stable){terminals++;assert.deepEqual(rows,allocationCases[id].live);}
  }
  assert.ok(terminals>0);
 }
 const q=allocationCreate();q.selected='loop';assert.deepEqual(allocationLiveUpdate(q,2),{before:[],after:[],next:[2,3],changed:true});assert.deepEqual(allocationLiveUpdate(q,1).after,[2,3]);assert.deepEqual(allocationRestore(q),q);assert.throws(()=>allocationLiveUpdate(q,3));
});
test('live snapshots determine every overlap and old drafts keep their placements',()=>{
 const expected={chain:[0,3,5],triangle:[0,1,3,5],loop:[0,1,2,3,4,5]};
 for(const id of Object.keys(expected)){const es=allocationCases[id].edges.map(([a,b])=>allocationPairs.findIndex(([x,y])=>x===a&&y===b)).sort();assert.deepEqual(es,expected[id]);for(let mask=0;mask<64;mask++){const p=allocationPairs.map((_,i)=>i).filter(i=>mask&(1<<i));assert.equal(allocationGraphCheck(id,p),p.length===expected[id].length&&p.every(i=>expected[id].includes(i)));}}
 const old=allocationCreate();for(const t of Object.values(old.trials)){delete t.pairs;delete t.graphVerified;}old.trials.chain.placements[0]='r1';const restored=allocationRestore(old);assert.equal(restored.trials.chain.placements[0],'r1');assert.deepEqual(restored.trials.chain.pairs,[]);assert.equal(restored.trials.chain.graphVerified,false);
 const forged=allocationCreate();forged.trials.chain.graphVerified=true;assert.throws(()=>allocationRestore(forged));
});
