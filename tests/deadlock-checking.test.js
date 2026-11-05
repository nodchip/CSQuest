import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDeadlockCheck,expandDeadlock,deadlockHeld,deadlockCheckComplete,restoreDeadlockCheck,retryState,manualRetryNext,manualRetryReplay,manualRetryCycle} from '../src/deadlock-checking.js';
test('opposite ordering reaches a deadlock; common ordering exhausts the finite state space',()=>{
 const s=createDeadlockCheck();for(const mode of ['opposite','same'])while(s.trials[mode].status==='searching'){const t=s.trials[mode];for(const state of t.queue){const a=deadlockHeld(mode,state,'a'),b=deadlockHeld(mode,state,'b');assert.equal(a.some(key=>b.includes(key)),false);}s.trials[mode]=expandDeadlock(t);}assert.deepEqual(s.trials.opposite.counterexample.path,['A：赤の鍵を取る','B：青の鍵を取る']);assert.equal(s.trials.same.status,'safe');assert.equal(deadlockCheckComplete(s),true);
});
test('synchronized retries cycle without work, while the chosen yielding schedule completes',()=>{
 const values=s=>[s.a,s.b,s.finished];
 assert.deepEqual(values(retryState('together',0)),values(retryState('together',2)));
 assert.deepEqual(values(retryState('together',1)),values(retryState('together',3)));
 assert.deepEqual(Array.from({length:8},(_,i)=>retryState('together',i).finished),Array(8).fill(0));
 assert.deepEqual(Array.from({length:8},(_,i)=>retryState('yield',i).finished),[0,0,0,0,1,1,1,2]);
 for(const mode of ['together','yield'])for(let i=0;i<=8;i++){
  const s=retryState(mode,i);for(const key of ['赤','青'])assert.equal(s.a.includes(key)&&s.b.includes(key),false);
 }
 assert.throws(()=>retryState('bad',0));assert.throws(()=>retryState('yield',9));
 const old=createDeadlockCheck();delete old.retryMode;delete old.retrySteps;
 const restored=restoreDeadlockCheck(old);assert.equal(restored.retryMode,'together');assert.deepEqual(restored.retrySteps,{together:0,yield:0});
 const saved=restoreDeadlockCheck({...old,retryMode:'yield',retrySteps:{together:4,yield:3}});assert.deepEqual(saved.retrySteps,{together:4,yield:3});
 assert.throws(()=>restoreDeadlockCheck({...old,retrySteps:{yield:9}}));
});
test('exploration resumes by replay and rejects impossible saved progress',()=>{
 const s=createDeadlockCheck();s.trials.opposite=expandDeadlock(s.trials.opposite);const copy=restoreDeadlockCheck({...s,trials:{...s.trials,opposite:{steps:1,status:'deadlock'}}});assert.equal(copy.trials.opposite.status,'searching');assert.deepEqual(copy.trials.opposite.seen,['0,0','1,0','0,1']);assert.throws(()=>restoreDeadlockCheck({...s,trials:{...s.trials,opposite:{steps:31}}}),RangeError);
});
test('players can create a repeated state and then choose a schedule that completes',()=>{
 const conflict=['a','b'],cycle=['a','a','b','b'];
 const original=manualRetryReplay(conflict),again=manualRetryReplay([...conflict,...cycle]);
 assert.deepEqual([original.a,original.b],[1,1]);assert.deepEqual([again.a,again.b],[1,1]);
 assert.deepEqual(manualRetryCycle([...conflict,...cycle]),{start:2,end:6,actions:cycle});
 assert.equal(manualRetryCycle(conflict),null);
 const done=[...conflict,...cycle,'a','b','b','a','a','a'];
 const end=manualRetryReplay(done);assert.deepEqual([end.a,end.b],[3,3]);
 assert.equal(manualRetryCycle(done),null);
 for(let i=0;i<=done.length;i++){const state=manualRetryReplay(done.slice(0,i));const a=deadlockHeld('opposite',state,'a'),b=deadlockHeld('opposite',state,'b');assert.equal(a.some(key=>b.includes(key)),false);}
 assert.equal(manualRetryNext(end,'a'),null);
 const old=createDeadlockCheck();delete old.manualHistory;assert.deepEqual(restoreDeadlockCheck(old).manualHistory,[]);
 const saved=restoreDeadlockCheck({...old,manualHistory:done});assert.deepEqual(manualRetryReplay(saved.manualHistory),end);
 assert.throws(()=>manualRetryReplay(['a','a','b']));assert.throws(()=>manualRetryReplay(['c']));assert.throws(()=>manualRetryReplay(Array(81).fill('a')));
});
test('all reachable retry states preserve exclusive keys and unfinished states have an enabled action',()=>{
 const queue=[manualRetryReplay([])],seen=new Set();
 while(queue.length){
  const state=queue.shift(),key=`${state.a},${state.b}`;if(seen.has(key))continue;seen.add(key);
  const a=deadlockHeld('opposite',state,'a'),b=deadlockHeld('opposite',state,'b');
  assert.equal(a.some(k=>b.includes(k)),false,key);
  const next=['a','b'].map(who=>manualRetryNext(state,who)).filter(Boolean);
  if(state.a!==3||state.b!==3)assert.ok(next.length>0,key);
  queue.push(...next);
 }
 assert.ok(seen.has('1,1'));assert.ok(seen.has('3,3'));
});
