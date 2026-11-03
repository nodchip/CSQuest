import test from 'node:test';
import assert from 'node:assert/strict';
import {argumentGraphs,argumentAnalyze,argumentDefended,argumentGrounded,argumentCreate,argumentRestore,argumentDone} from '../src/argument-boards.js';
test('chain and cycle have the expected grounded and stable extensions',()=>{
 const extensions=g=>Array.from({length:8},(_,m)=>m).filter(m=>argumentAnalyze(g,m).stable);
 assert.deepEqual(extensions('chain'),[5]);assert.deepEqual(extensions('cycle'),[2,5]);assert.equal(argumentGrounded(argumentGraphs.chain.attacks),5);assert.equal(argumentGrounded(argumentGraphs.cycle.attacks),0);
 assert.equal(argumentAnalyze('cycle',1).admissible,true);assert.equal(argumentAnalyze('cycle',1).stable,false);assert.equal(argumentAnalyze('cycle',3).conflictFree,false);
});
test('for all three-argument attack graphs grounded is the least complete extension',()=>{
 const pairs=Array.from({length:9},(_,i)=>[Math.floor(i/3),i%3]);
 for(let edgeMask=0;edgeMask<512;edgeMask++){
  const edges=pairs.filter((_,i)=>edgeMask&(1<<i)),grounded=argumentGrounded(edges);
  const defended=s=>[0,1,2].reduce((out,a)=>{const attackers=edges.filter(e=>e[1]===a).map(e=>e[0]);return attackers.every(x=>edges.some(e=>e[1]===x&&(s&(1<<e[0]))))?out|(1<<a):out;},0);
  const complete=Array.from({length:8},(_,i)=>i).filter(s=>!edges.some(([a,b])=>(s&(1<<a))&&(s&(1<<b)))&&defended(s)===s);
  for(let s=0;s<8;s++)assert.equal(argumentDefended(edges,s),defended(s));
  assert.ok(complete.includes(grounded));assert.ok(complete.every(s=>(grounded&s)===grounded));
 }
});
test('saved observations, contrasting examples and reflection are required',()=>{
 const q=argumentCreate();q.seen={chain:[5],cycle:[0,1,2,3,5]};q.reflection='models';assert.equal(argumentDone(q),true);const copy=argumentRestore(q);copy.seen.cycle.pop();assert.equal(q.seen.cycle.length,5);assert.equal(argumentDone(copy),false);assert.throws(()=>argumentRestore({...q,seen:{chain:[5,5],cycle:[]}}));
});
