import test from 'node:test';
import assert from 'node:assert/strict';
import {focusChecks,createFocusDialog,toggleFocusFix,checkFocusPath,focusPathPass,focusDialogComplete,restoreFocusDialog} from '../src/focus-dialog.js';

test('all 16 improvement combinations expose the expected barriers',()=>{
 const keys=['entry','visible','exit','label'];
 for(let bits=0;bits<16;bits++){
  let s=createFocusDialog();for(let i=0;i<keys.length;i++)if(bits&(1<<i))s=toggleFocusFix(s,keys[i]);
  assert.equal(focusPathPass(s,'navigate'),Boolean((bits&1)&&(bits&2)));
  assert.equal(focusPathPass(s,'return'),Boolean((bits&1)&&(bits&4)));
  assert.equal(focusPathPass(s,'reader'),Boolean((bits&1)&&(bits&8)));
  for(const id of Object.keys(focusChecks))s=checkFocusPath(s,id);
  s={...s,answer:'conditions',checked:true};assert.equal(focusDialogComplete(s),bits===15);
 }
});
test('changing a fix requires retesting and restoration rejects invalid records',()=>{
 let s=createFocusDialog();for(const k of ['entry','visible','exit','label'])s=toggleFocusFix(s,k);for(const k of Object.keys(focusChecks))s=checkFocusPath(s,k);s={...s,answer:'conditions',checked:true};
 assert.equal(focusDialogComplete(restoreFocusDialog(s)),true);const changed=toggleFocusFix(s,'label');assert.deepEqual(changed.tested,[]);assert.equal(changed.last,null);assert.equal(focusDialogComplete(changed),false);
 assert.throws(()=>restoreFocusDialog({...s,tested:['reader','reader']}));assert.throws(()=>restoreFocusDialog({...s,last:'unknown'}));assert.throws(()=>restoreFocusDialog({...s,config:{...s.config,entry:1}}));
});
