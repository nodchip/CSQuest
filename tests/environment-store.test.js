import {test} from 'node:test';
import assert from 'node:assert/strict';
import {envStoreActions,envStoreInitial,envStoreBinding,envStoreExpected,envStoreExecute,envStoreReplay,envStoreCreate,envStoreStep,envStoreComplete,envStoreRestore} from '../src/environment-store.js';

const actions=['enter','loc:B','write:9','read:2','leave','loc:A','write:4','read:4','loc:none','reject'];
test('shadowing changes the name binding; aliases share a store location',()=>{
 const s=envStoreInitial(),history=[];assert.deepEqual(envStoreBinding(s,'C'),{value:5});for(const [i,action] of actions.entries()){assert.equal(envStoreExpected(s),action);for(const wrong of Object.keys(envStoreActions).filter(a=>a!==action))assert.throws(()=>envStoreExecute(structuredClone(s),wrong));envStoreExecute(s,action);history.push(action);assert.deepEqual(envStoreReplay(history),s);if(i===2){assert.equal(s.store.B,9);assert.equal(s.store.A,2);assert.equal(envStoreBinding(s,'X').loc,'B');}if(i===4){assert.equal(envStoreBinding(s,'X').loc,'A');assert.equal('B' in s.store,false);}if(i===6){assert.equal(s.store.A,4);assert.equal(envStoreBinding(s,'Y').loc,'A');}}assert.equal(s.stage,10);assert.throws(()=>envStoreExecute(s,'reject'));
});
test('valid replay and reflection are required and restored without sharing history',()=>{
 const q=envStoreCreate();for(const a of actions){envStoreStep(q,a);assert.deepEqual(envStoreRestore(q),q);}assert.equal(envStoreComplete(q),false);q.answer='binding';assert.equal(envStoreComplete(q),true);assert.throws(()=>envStoreRestore({history:['write:9'],answer:null}));const copy=envStoreRestore(q);copy.history.pop();assert.equal(q.history.length,10);
});
