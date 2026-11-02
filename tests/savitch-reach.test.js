import {test} from 'node:test';
import assert from 'node:assert/strict';
import {savitchNodes,savitchEdges,savitchTrace,savitchCases,savitchFrames,savitchCreate,savitchAdvance,savitchComplete,savitchRestore} from '../src/savitch-reach.js';

test('recursive bounded reach agrees with independent breadth-first search for every pair and depth',()=>{
 for(const from of savitchNodes)for(const to of savitchNodes)for(let k=0;k<=2;k++){
  let visited=new Set([from]),frontier=[from];for(let i=0;i<2**k;i++){const next=[];for(const u of frontier)for(const [a,b] of savitchEdges)if(a===u&&!visited.has(b)){visited.add(b);next.push(b);}frontier=next;}
  const frames=savitchTrace(from,to,k),last=frames.at(-1);assert.equal(last.result,visited.has(to));assert.ok(last.peak<=k+1);assert.equal(last.calls,frames.filter(x=>x.type==='enter').length);assert.equal(last.peak,Math.max(...frames.map(x=>x.stack.length)));
 }
});
test('bounded true and false cases plus the stack reuse explanation are required',()=>{
 let q=savitchCreate();for(const id of Object.keys(savitchCases)){q.selected=id;savitchAdvance(q,10);q=savitchRestore(q);savitchAdvance(q,1000);const last=savitchFrames(id).at(-1);q.answers[id]=last.result?'yes':'no';}
 assert.deepEqual(Object.fromEntries(Object.keys(savitchCases).map(id=>[id,savitchFrames(id).at(-1).result])),{short:false,long:true,back:false});q.reflection='store';assert.equal(savitchComplete(q),false);q.reflection='reuse';assert.equal(savitchComplete(q),true);const copy=savitchRestore(q);copy.positions.long=0;assert.equal(savitchComplete(copy),false);assert.equal(savitchComplete(q),true);assert.throws(()=>savitchRestore({...q,positions:{...q.positions,short:999999}}));
});
