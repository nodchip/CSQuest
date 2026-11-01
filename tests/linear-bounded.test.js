import test from 'node:test';
import assert from 'node:assert/strict';
import {boundedTrace,createLinearBounded,linearBoundedComplete,restoreLinearBounded} from '../src/linear-bounded.js';

test('all offered inputs halt, preserve tape length, and accept exactly equal counts',()=>{
 for(let a=0;a<=3;a++)for(let b=0;b<=3;b++)for(let c=0;c<=3;c++){
  const end=boundedTrace(a,b,c);assert.ok(end.steps<128);assert.equal(end.phase,a===b&&b===c?'accept':'reject');
  for(let n=0;n<=end.steps;n++){
   const r=boundedTrace(a,b,c,n);assert.equal(r.tape.length,a+b+c);assert.ok(r.head>=0&&r.head<=r.tape.length);
   assert.ok(r.tape.every(ch=>'abcXYZ'.includes(ch)));
  }
 }
});
test('completion requires all three observed outcomes and the correct explanation',()=>{
 const s=createLinearBounded();s.observed=['2,2,2','2,2,1','0,0,0'];s.checked=true;s.answer='bounded';assert.equal(linearBoundedComplete(restoreLinearBounded(s)),true);
 assert.equal(linearBoundedComplete({...s,answer:'constant'}),false);assert.equal(linearBoundedComplete({...s,observed:['2,2,2','0,0,0']}),false);
 assert.throws(()=>restoreLinearBounded({...s,observed:['2,2,2','2,2,2']}));assert.throws(()=>restoreLinearBounded({...s,steps:128}));
});
