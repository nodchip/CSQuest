import test from 'node:test';
import assert from 'node:assert/strict';
import {syscallCases,syscallActions,createSyscall,syscallStatus,syscallStep,restoreSyscall,syscallComplete} from '../src/syscall.js';

test('direct access stays in user mode and is denied',()=>{
  let actions=[];actions=syscallStep('direct',actions,'direct').actions;
  assert.equal(syscallStatus('direct',actions).mode,'利用者モード');
  assert.deepEqual(syscallStep('direct',actions,'allow').actions,actions);
  actions=syscallStep('direct',actions,'deny').actions;assert.equal(syscallStatus('direct',actions).done,true);
});
test('both system calls enter kernel mode, check permission and return to user mode',()=>{
  for(const id of ['allowed','denied']){let actions=[];actions=syscallStep(id,actions,'call').actions;assert.equal(syscallStatus(id,actions).mode,'カーネルモード');
    const decision=id==='allowed'?'allow':'deny';assert.deepEqual(syscallStep(id,actions,decision==='allow'?'deny':'allow').actions,actions);
    actions=syscallStep(id,actions,decision).actions;assert.equal(syscallStatus(id,actions).mode,'カーネルモード');actions=syscallStep(id,actions,'return').actions;assert.equal(syscallStatus(id,actions).mode,'利用者モード');}
});
test('restoration accepts only valid prefixes and completion requires all cases',()=>{
  const state=createSyscall();assert.equal(syscallComplete(state),false);
  for(const id of Object.keys(syscallCases)){for(const action of syscallCases[id].path)state.actions[id]=syscallStep(id,state.actions[id],action).actions;}
  assert.equal(syscallComplete(restoreSyscall(state)),true);
  for(const id of Object.keys(syscallCases))for(const action of Object.keys(syscallActions))if(action!==syscallCases[id].path[0])assert.throws(()=>restoreSyscall({...state,actions:{...state.actions,[id]:[action]}}),RangeError);
});
