import test from 'node:test';
import assert from 'node:assert/strict';
import {compareOps,compareGoals,compareApply,compareTrace,comparePost,compareWeakest,compareCreate,compareConfigure,compareStep,compareCheck,compareComplete,compareRestore} from '../src/semantics-comparison.js';

test('operational steps compose to the denotation for every program and initial state',()=>{
 const oracle={inc:[1,2,3,0],double:[0,2,0,2],reset:[0,0,0,0]};
 for(const a of Object.keys(compareOps))for(const b of Object.keys(compareOps))for(let x=0;x<4;x++){const trace=compareTrace([a,b],x);assert.deepEqual(trace,[x,oracle[a][x],oracle[b][oracle[a][x]]]);assert.equal(compareApply(a,x),oracle[a][x]);}
});
test('computed weakest precondition includes exactly all safe initial states and every valid precondition is a subset',()=>{
 for(const a of Object.keys(compareOps))for(const b of Object.keys(compareOps))for(const goal of Object.keys(compareGoals)){
  const wp=compareWeakest([a,b],goal);for(let pre=0;pre<16;pre++){let valid=true;for(let x=0;x<4;x++)if((pre&(1<<x))&&!comparePost(goal,compareTrace([a,b],x)[2]))valid=false;assert.equal(valid,(pre&~wp)===0);}
 }
});
test('the player must derive all four traces and select the weakest precondition',()=>{
 const s=compareCreate();assert.equal(compareCheck(s).ok,false);for(let x=0;x<4;x++){s.selected=x;for(let i=0;i<2;i++){const expected=compareTrace(s.ops,x)[i+1];s.choice=(expected+1)%4;assert.equal(compareStep(s).ok,false);s.choice=expected;assert.ok(compareStep(s).ok);}}s.mask=0;assert.equal(compareCheck(s).ok,false);s.mask=compareWeakest(s.ops,s.goal);assert.ok(compareCheck(s).ok);assert.ok(s.flags.includes('some'));
 compareConfigure(s,0,'double');compareConfigure(s,1,'inc');compareConfigure(s,'goal','even');s.steps=[2,2,2,2];s.mask=0;assert.ok(compareCheck(s).ok);compareConfigure(s,0,'reset');compareConfigure(s,1,'reset');s.steps=[2,2,2,2];s.mask=15;assert.ok(compareCheck(s).ok);s.answer='three';s.checked=true;assert.ok(compareComplete(s));const c=compareRestore(s);c.steps[0]=0;assert.equal(s.steps[0],2);assert.throws(()=>compareRestore({...s,steps:[3,0,0,0]}));
});
