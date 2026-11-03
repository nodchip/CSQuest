import test from 'node:test';
import assert from 'node:assert/strict';
import {computeRescueReplay,computeRescueCreate,computeRescueRestore} from '../src/compute-rescue-journey.js';
const workers=['3','6','5','8','7','10','skip','skip'].map((answer,i)=>({type:'worker',block:Math.floor(i/4),lane:i%4,answer}));
const pre=[{type:'depart'},...workers,{type:'leave-forge'}];
const shelf=[{type:'pattern',pattern:'packed',guess:1},{type:'pattern',pattern:'stride',guess:4},{type:'memory-choice',choice:'packed'},{type:'leave-shelf'}];
const seal=[{type:'mode',mode:'instructions',guess:320},{type:'mode',mode:'device',guess:228},{type:'crypto-choice',choice:'device'},{type:'seal',choice:'auth'},{type:'deliver'}];
test('all stages require correct work, a comparison and authenticated delivery',()=>{
 assert.throws(()=>computeRescueReplay([{type:'depart'},{type:'leave-forge'}]));assert.throws(()=>computeRescueReplay([{type:'depart'},{...workers[0],answer:'5'}]));assert.throws(()=>computeRescueReplay([{type:'depart'},workers[0],workers[0]]));
 assert.throws(()=>computeRescueReplay([...pre,{type:'pattern',pattern:'packed',guess:4}]));assert.throws(()=>computeRescueReplay([...pre,...shelf.slice(0,2),{type:'memory-choice',choice:'stride'}]));
 assert.throws(()=>computeRescueReplay([...pre,...shelf,{type:'deliver'}]));assert.throws(()=>computeRescueReplay([...pre,...shelf,...seal.slice(0,2),{type:'crypto-choice',choice:'instructions'}]));assert.throws(()=>computeRescueReplay([...pre,...shelf,...seal.slice(0,3),{type:'seal',choice:'encrypt'}]));
 const r=computeRescueReplay([...pre,...shelf,...seal]);assert.equal(r.place,'tower');assert.equal(r.workers.length,8);assert.deepEqual(r.patterns,['packed','stride']);assert.equal(r.sealed,true);
});
test('replay supports arbitrary worker order and validates and copies saved progress',()=>{
 const q=computeRescueCreate();q.history=[{type:'depart'},...workers.toReversed()];assert.equal(computeRescueReplay(q.history).workers.length,8);const restored=computeRescueRestore(q);restored.history[1].answer='3';assert.equal(q.history[1].answer,'skip');assert.throws(()=>computeRescueRestore(restored));
 assert.throws(()=>computeRescueRestore({...q,history:[{type:'depart'},{type:'leave-forge'}]}));assert.throws(()=>computeRescueRestore({...q,lane:4}));
});
