import test from 'node:test';
import assert from 'node:assert/strict';
import {replicaEvaluate,replicaCreate,replicaRestore,replicaDone,replicaRequired} from '../src/redundant-write.js';
test('all twelve write and fault combinations have the expected response and writes',()=>{
 const expected={single:[[2,'A'],[null,''],[2,'A'],[null,'']],strict:[[4,'AB'],[null,'B'],[null,'A'],[null,'']],degraded:[[4,'AB'],[4,'B'],[2,'A'],[null,'']]};
 for(const [strategy,rows] of Object.entries(expected))for(const [i,fault] of ['none','A','B','both'].entries()){
  const r=replicaEvaluate(strategy,fault),[time,nodes]=rows[i];assert.equal(r.time,time);assert.equal(r.writes.map(w=>w.node).join(''),nodes);assert.equal(r.copies,nodes.length);assert.deepEqual(r.writes.map(w=>w.time),[...nodes].map(n=>n==='A'?2:4));
 }
 assert.throws(()=>replicaEvaluate('constructor','none'));
});
test('completion requires each comparison and both conclusions',()=>{
 const q=replicaCreate();q.seen=[...replicaRequired];q.reflection='risk';q.backup='backup';assert.equal(replicaDone(q),true);
 for(const key of replicaRequired){const copy={...q,seen:q.seen.filter(x=>x!==key)};assert.equal(replicaDone(copy),false);}
 assert.equal(replicaDone({...q,reflection:'safe'}),false);assert.equal(replicaDone({...q,backup:'copies'}),false);
});
test('restores only valid independent records',()=>{
 const q=replicaCreate();q.seen=['strict:B'];const restored=replicaRestore(q);restored.seen.push('single:A');assert.deepEqual(q.seen,['strict:B']);
 for(const seen of [['strict:B','strict:B'],['constructor:none'],['strict:bad'],[null]])assert.throws(()=>replicaRestore({...q,seen}));
 assert.throws(()=>replicaRestore({...q,guess:'3'}));
});
