import test from 'node:test';
import assert from 'node:assert/strict';
import {underspecEvaluate,underspecCreate,underspecRestore,underspecDone} from '../src/underspecification.js';
test('counterfactual backgrounds expose two rules with identical original accuracy',()=>{
 for(let mask=0;mask<16;mask++){
  assert.equal(underspecEvaluate('shape',mask).correct,4);
  const result=underspecEvaluate('background',mask);
  assert.equal(result.correct,4-mask.toString(2).replaceAll('0','').length);
  for(let i=0;i<4;i++)assert.equal(result.rows[i].correct,!(mask&(1<<i)));
 }
 assert.throws(()=>underspecEvaluate('shape',16));
});
test('completion needs both rules, both extremes, a partial change and qualified conclusions',()=>{
 const q=underspecCreate();q.seen=['shape:0','background:0','shape:15','background:15'];q.answer='stress';q.limits='monitor';assert.equal(underspecDone(q),false);q.seen.push('background:3');assert.equal(underspecDone(q),true);
 const restored=underspecRestore(q);restored.seen.pop();assert.equal(q.seen.length,5);assert.throws(()=>underspecRestore({...q,seen:['shape:16']}));assert.throws(()=>underspecRestore({...q,seen:['shape:0','shape:0']}));
});
