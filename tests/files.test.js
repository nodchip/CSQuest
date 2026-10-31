import test from 'node:test';
import assert from 'node:assert/strict';
import {createFiles,availableFileActions,stepFiles,restoreFiles} from '../src/files.js';

test('two names share one file; an open reference survives unlinking the last name',()=>{
  let s=createFiles();for(const action of ['link','open','removeSun'])s=stepFiles(s,action);
  assert.equal(s.sun,false);assert.equal(s.moon,true);assert.equal(s.opened,true);
  s=stepFiles(s,'removeMoon');assert.equal(s.anonymous,true);assert.equal(s.sun||s.moon,false);assert.ok(availableFileActions(s).includes('read'));
  s=stepFiles(s,'read');assert.equal(s.readAnonymous,true);s=stepFiles(s,'close');assert.equal(s.done,true);assert.equal(s.sun||s.moon||s.opened,false);
});
test('losing the last name without an open reference leaves no way to reopen',()=>{
  let s=stepFiles(createFiles(),'removeSun');assert.deepEqual(availableFileActions(s),[]);assert.equal(s.done,false);
  assert.throws(()=>stepFiles(s,'open'),RangeError);
  s=restoreFiles(['link','open','removeSun','removeMoon','close']);assert.equal(s.done,false);assert.deepEqual(availableFileActions(s),[]);
});
test('all reachable short operation sequences preserve name and reference invariants',()=>{
  let states=[createFiles()];
  for(let depth=0;depth<8;depth++){
    const next=[];for(const s of states)for(const action of availableFileActions(s)){
      const n=stepFiles(s,action);if(n.done){assert.ok(n.readAnonymous&&n.anonymous&&n.oneRemoved&&n.linked);assert.equal(n.sun||n.moon||n.opened,false);}
      if(!n.sun&&!n.moon&&!n.opened)assert.deepEqual(availableFileActions(n),[]);
      assert.deepEqual(restoreFiles(n.history),n);next.push(n);
    }states=next;
  }
  assert.throws(()=>restoreFiles(['open','open']),RangeError);
  assert.throws(()=>restoreFiles(['link','removeSun','removeSun']),RangeError);
});
