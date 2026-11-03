import test from 'node:test';
import assert from 'node:assert/strict';
import {confidentialCases,confidentialClaims,confidentialReplay,confidentialCreate,confidentialRestore,confidentialDone} from '../src/confidential-container.js';
const perm=xs=>xs.length?xs.flatMap((x,i)=>perm([...xs.slice(0,i),...xs.slice(i+1)]).map(rest=>[x,...rest])):[[]];
test('every authenticated claim-check order accepts only evidence A and rejects each mismatch',()=>{
 const orders=perm(Object.keys(confidentialClaims));assert.equal(orders.length,24);
 for(const [id,c] of Object.entries(confidentialCases))for(const order of orders){
  if(!c.signature){assert.throws(()=>confidentialReplay(id,['signature',order[0]]));assert.equal(confidentialReplay(id,['signature','hold']).decision,'hold');assert.throws(()=>confidentialReplay(id,['signature','release']));continue;}
  const decision=id==='A'?'release':'hold',r=confidentialReplay(id,['signature',...order,decision]);assert.equal(r.decision,decision);assert.equal(r.checked.length,4);assert.throws(()=>confidentialReplay(id,['signature',...order,decision==='release'?'hold':'release']));
 }
 assert.throws(()=>confidentialReplay('A',['nonce']));assert.throws(()=>confidentialReplay('A',['signature','release']));assert.throws(()=>confidentialReplay('A',['signature','nonce','nonce']));
});
test('all six decisions and the limited conclusion are required, and restored histories are copied',()=>{
 const q=confidentialCreate();for(const [id,c] of Object.entries(confidentialCases))q.histories[id]=c.signature?['signature',...Object.keys(confidentialClaims),id==='A'?'release':'hold']:['signature','hold'];q.reflection='review';assert.equal(confidentialDone(q),true);
 for(const k of Object.keys(confidentialCases))assert.equal(confidentialDone({...q,histories:{...q.histories,[k]:[]}}),false);assert.equal(confidentialDone({...q,reflection:'guarantee'}),false);
 const r=confidentialRestore(q);r.histories.A.pop();assert.equal(q.histories.A.length,6);assert.throws(()=>confidentialRestore({...q,histories:{...q.histories,D:['signature','image']}}));
});
