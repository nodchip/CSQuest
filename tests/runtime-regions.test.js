import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runtimeActions,runtimeInitial,runtimeExpected,runtimeExecute,runtimeReplay,runtimeCreate,runtimeStep,runtimeComplete,runtimeRestore} from '../src/runtime-regions.js';

const steps=['allocate','call','increment','call','increment','call','return','return','return','free','judge:dangling','clear'];
test('recursion preserves the global reference and heap across stack returns',()=>{
 const s=runtimeInitial(),history=[];for(const [i,action] of steps.entries()){assert.equal(runtimeExpected(s),action);for(const wrong of Object.keys(runtimeActions).filter(x=>x!==action))assert.throws(()=>runtimeExecute(structuredClone(s),wrong));runtimeExecute(s,action);history.push(action);assert.deepEqual(runtimeReplay(history),s);if(i===5){assert.deepEqual(s.frames.map(x=>x.n),[2,1,0]);assert.equal(s.peak,3);assert.equal(s.heap.value,2);}if(i===8){assert.equal(s.frames.length,0);assert.deepEqual(s.heap,{alive:true,value:2});assert.equal(s.global,'H');}if(i===9){assert.equal(s.global,'H');assert.equal(s.heap.alive,false);}}
 assert.equal(s.phase,'done');assert.equal(s.global,null);assert.throws(()=>runtimeExecute(s,'free'));
});
test('restoration rejects out-of-order operations; finishing needs explanation',()=>{
 const q=runtimeCreate();for(const step of steps){runtimeStep(q,step);assert.deepEqual(runtimeRestore(q),q);}assert.equal(runtimeComplete(q),false);q.answer='separate';assert.equal(runtimeComplete(q),true);assert.throws(()=>runtimeRestore({history:['free'],answer:'separate'}));const copy=runtimeRestore(q);copy.history.pop();assert.equal(q.history.length,12);
});
