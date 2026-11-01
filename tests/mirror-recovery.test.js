import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMirror,stepMirror,mirrorComplete,restoreMirror} from '../src/mirror-recovery.js';
import {raidAct,raidStripes} from '../src/raid-lab.js';
test('a failed device and replicated mistaken update require distinct recovery paths',()=>{
 const s=createMirror();let a=s.trials.failure;a=stepMirror(a,'event');assert.equal(a.primary,null);assert.equal(a.replica,4);a=stepMirror(a,'inspect');const blocked=stepMirror(a,'restore');assert.equal(blocked.stage,'inspected');a=stepMirror(blocked,'promote');assert.equal(a.primary,4);assert.equal(a.replica,null);s.trials.failure=a;
 let b=s.trials.mistake;b=stepMirror(b,'event');assert.deepEqual([b.primary,b.replica,b.backup],[0,0,4]);b=stepMirror(b,'inspect');assert.equal(stepMirror(b,'promote').stage,'inspected');b=stepMirror(b,'restore');s.trials.mistake=b;assert.equal(mirrorComplete(s),false);
 const act=action=>{const r=raidAct(s.raid,action);assert.equal(r.ok,true);s.raid=r.state;};
 for(const action of ['toggle:a','test','case:b','test','case:p','toggle:p','test','case:ab','test','toggle:a','toggle:b','test','answer:ambiguous'])act(action);
 for(let disk=0;disk<3;disk++){act(`disk:${disk}`);for(let row=0;row<3;row++)if(s.raid.stripeGuesses[row]!==raidStripes[row][disk].bit)act(`stripe:${row}`);act('rebuild');}act('check');
 assert.equal(mirrorComplete(s),true);assert.equal(mirrorComplete(restoreMirror(s)),true);
});
test('restore replays valid histories and ignores forged data',()=>{
 const s=createMirror();s.trials.mistake=stepMirror(s.trials.mistake,'event');const copy=restoreMirror({...s,trials:{...s.trials,mistake:{...s.trials.mistake,primary:4}}});assert.equal(copy.trials.mistake.primary,0);assert.throws(()=>restoreMirror({...s,trials:{...s.trials,failure:{history:['bad']}}}),RangeError);
 const old={...s};delete old.raid;assert.deepEqual(restoreMirror(old).raid.history,[]);
});
