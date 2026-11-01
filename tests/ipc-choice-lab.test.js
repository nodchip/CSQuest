import test from 'node:test';
import assert from 'node:assert/strict';
import {ipcChoiceCases,ipcOptions,ipcPrecautions,createIpcChoices,ipcChoiceCorrect,ipcChoicesComplete,restoreIpcChoices} from '../src/ipc-choice-lab.js';

test('each task requires the matching mechanism and precaution',()=>{
  const expected={child:['pipe','ends'],local:['shared','sync'],remote:['socket','framing']},s=createIpcChoices();
  for(const [id,[method,precaution]] of Object.entries(expected)){
    for(const m of Object.keys(ipcOptions))for(const p of Object.keys(ipcPrecautions))assert.equal(ipcChoiceCorrect(id,{method:m,precaution:p,checked:true}),m===method&&p===precaution);
    s.trials[id]={method,precaution,checked:true};
  }
  assert.equal(Object.keys(ipcChoiceCases).length,3);assert.equal(ipcChoicesComplete(s),true);
  const copy=restoreIpcChoices(s);copy.trials.child.checked=false;assert.equal(ipcChoicesComplete(copy),false);assert.equal(s.trials.child.checked,true);
  assert.throws(()=>restoreIpcChoices({...s,trials:{...s.trials,local:{method:'bad',precaution:'sync',checked:true}}}));
});
