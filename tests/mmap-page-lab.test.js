import test from 'node:test';
import assert from 'node:assert/strict';
import {mmapPageCases,mmapPageCreate,mmapPageTrial,mmapPageStep,mmapPageViews,mmapPageReplay,mmapPageComplete,mmapPageRestore} from '../src/mmap-page-lab.js';

test('four page mappings preserve visibility and modeled writeback',()=>{
 const q=mmapPageCreate();
 for(const id of mmapPageCases){
  const [mode,off]=id.split(':'),original=off==='0'?'ABCD':'EFGH',changed=off==='0'?'AXCD':'EXGH',guess=mode==='shared'?'X':off==='0'?'B':'F';let s=mmapPageTrial(id);
  for(const a of [`map:${off}`,'write']){const r=mmapPageStep(s,a);assert.equal(r.ok,true);s=r.state;}
  assert.deepEqual(mmapPageViews(s),{a:changed,b:mode==='shared'?changed:original,backing:original,copies:mode==='private'?1:0});
  for(const a of [`guess:${guess}`,'read',...(mode==='shared'?['sync']:[])]){const r=mmapPageStep(s,a);assert.equal(r.ok,true);s=r.state;}
  assert.equal(mmapPageViews(s).backing,mode==='shared'?changed:original);q.trials[id]=s.history;
 }
 assert.equal(mmapPageComplete(q),false);q.reflection='limits';assert.equal(mmapPageComplete(q),true);
 const restored=mmapPageRestore(q);assert.deepEqual(restored,q);restored.trials['shared:0'].push('x');assert.notDeepEqual(restored,q);
});
test('alignment, sequence, predictions and stored histories are checked',()=>{
 let s=mmapPageTrial('private:4');
 for(const a of ['map:2','map:0','write','guess:X','read','sync'])assert.equal(mmapPageStep(s,a).ok,false);
 s=mmapPageStep(s,'map:4').state;s=mmapPageStep(s,'write').state;assert.equal(mmapPageStep(s,'guess:X').ok,false);assert.equal(mmapPageStep(s,'sync').ok,false);
 assert.throws(()=>mmapPageReplay('private:4',['map:2']));assert.throws(()=>mmapPageReplay('shared:0',['map:0','write','guess:B']));
 const q=mmapPageCreate();q.trials['shared:0']=['map:0','sync'];assert.throws(()=>mmapPageRestore(q));
});
