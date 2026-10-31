import test from 'node:test';
import assert from 'node:assert/strict';
import {walCases,walDisk,walCorrect,createWal,restoreWal,walComplete} from '../src/wal-recovery.js';
test('undo incomplete transaction and redo committed transaction from either disk state',()=>{
 const s=createWal();assert.deepEqual(walDisk('uncommitted',s.choices.uncommitted),{a:7,b:2});assert.deepEqual(walDisk('committed',s.choices.committed),{a:10,b:2});
 for(const [id,item] of Object.entries(walCases)){const c=s.choices[id];c.actions={a:item.committed?'after':'before',b:item.committed?'after':'before'};c.checked=true;assert.equal(walCorrect(id,c),true);assert.deepEqual(walDisk(id,c),item.committed?{a:7,b:5}:{a:10,b:2});}
 assert.equal(walComplete(s),true);
});
test('all accounts must select the right direction and drafts are copied and validated',()=>{
 const s=createWal();s.choices.partial={actions:{a:'after',b:''},checked:true};assert.equal(walCorrect('partial',s.choices.partial),false);const r=restoreWal(s);s.choices.partial.actions.a='before';assert.equal(r.choices.partial.actions.a,'after');r.choices.partial.actions.a='bad';assert.throws(()=>restoreWal(r),RangeError);
});
