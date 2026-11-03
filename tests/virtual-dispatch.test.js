import test from 'node:test';
import assert from 'node:assert/strict';
import {virtualDispatchCreate,virtualDispatchRun,virtualDispatchDone,virtualDispatchRestore} from '../src/virtual-dispatch.js';

test('all objects, calls, tables and slots select the expected implementation',()=>{
 const expect={base:['ふつうの灯す動作','共通のあいさつ'],fire:['火の灯す動作','共通のあいさつ']};
 for(const object of ['base','fire'])for(const [method,index] of [['light',0],['greet',1]])for(const table of ['base','fire'])for(const slot of [0,1]){
  const r=virtualDispatchRun({object,method,table,slot});
  assert.equal(r.implementation,expect[table][slot]);
  assert.equal(r.correct,table===object&&slot===index);
 }
 assert.throws(()=>virtualDispatchRun({...virtualDispatchCreate()}));
});
test('all four calls and the reflection are needed, saved records are validated and copied',()=>{
 const q=virtualDispatchCreate();q.seen=['base:light','base:greet','fire:light','fire:greet'];q.answer='runtime';
 assert.equal(virtualDispatchDone(q),false);q.checked=true;assert.equal(virtualDispatchDone(q),true);
 const r=virtualDispatchRestore(q);r.seen.pop();assert.equal(q.seen.length,4);
 q.seen.push('fire:greet');assert.throws(()=>virtualDispatchRestore(q));
});
