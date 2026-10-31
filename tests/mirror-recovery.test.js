import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMirror,stepMirror,mirrorComplete,restoreMirror} from '../src/mirror-recovery.js';
test('a failed device and replicated mistaken update require distinct recovery paths',()=>{
 const s=createMirror();let a=s.trials.failure;a=stepMirror(a,'event');assert.equal(a.primary,null);assert.equal(a.replica,4);a=stepMirror(a,'inspect');const blocked=stepMirror(a,'restore');assert.equal(blocked.stage,'inspected');a=stepMirror(blocked,'promote');assert.equal(a.primary,4);assert.equal(a.replica,null);s.trials.failure=a;
 let b=s.trials.mistake;b=stepMirror(b,'event');assert.deepEqual([b.primary,b.replica,b.backup],[0,0,4]);b=stepMirror(b,'inspect');assert.equal(stepMirror(b,'promote').stage,'inspected');b=stepMirror(b,'restore');s.trials.mistake=b;assert.equal(mirrorComplete(s),true);
});
test('restore replays valid histories and ignores forged data',()=>{
 const s=createMirror();s.trials.mistake=stepMirror(s.trials.mistake,'event');const copy=restoreMirror({...s,trials:{...s.trials,mistake:{...s.trials.mistake,primary:4}}});assert.equal(copy.trials.mistake.primary,0);assert.throws(()=>restoreMirror({...s,trials:{...s.trials,failure:{history:['bad']}}}),RangeError);
});
