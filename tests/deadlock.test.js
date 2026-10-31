import test from 'node:test';
import assert from 'node:assert/strict';
import {createLockTrial,stepTwoLocks,restoreTwoLocks,locksComplete} from '../src/deadlock.js';
const unsafe=['A','B','A','B'];
const safe=['A','B','A','A','A','A','B','B','B','B','B'];
function play(mode,steps){return steps.reduce(stepTwoLocks,createLockTrial(mode));}
test('opposite ordering can create a circular wait in which neither can progress',()=>{
  const s=play('opposing',unsafe);assert.equal(s.status,'deadlocked');assert.deepEqual(s.owners,{sun:'A',moon:'B'});assert.ok(s.workers.A.waiting&&s.workers.B.waiting);
});
test('common ordering allows contention followed by both jobs completing',()=>{
  const s=play('ordered',safe);assert.equal(s.status,'done');assert.equal(s.waited,true);assert.deepEqual(s.owners,{sun:null,moon:null});assert.equal(locksComplete({opposing:play('opposing',unsafe),ordered:s}),true);
});
test('repeated waits do not grow saved history and both trials resume independently',()=>{
  let s=play('ordered',['A','B']);assert.equal(stepTwoLocks(s,'B').log.length,s.log.length);
  const restored=restoreTwoLocks({selected:'ordered',steps:{opposing:unsafe,ordered:['A','B']}});assert.equal(restored.states.opposing.status,'deadlocked');assert.equal(restored.states.ordered.waited,true);
  assert.throws(()=>restoreTwoLocks({selected:'ordered',steps:{opposing:[],ordered:['A','B','B']}}),RangeError);
});
test('no reachable nonterminal state with a common lock order has a circular wait',()=>{
  const pending=[createLockTrial('ordered')],seen=new Set();
  while(pending.length){const s=pending.pop(),key=JSON.stringify([s.owners,s.workers,s.status]);if(seen.has(key))continue;seen.add(key);assert.notEqual(s.status,'deadlocked');if(s.status!=='playing')continue;for(const id of ['A','B'])if(s.workers[id].stage<5){const n=stepTwoLocks(s,id);if(n.log.length>s.log.length)pending.push(n);}}
  assert.ok(seen.size>10);
});
