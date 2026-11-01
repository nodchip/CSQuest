import test from 'node:test';
import assert from 'node:assert/strict';
import {raidValid,raidCases,raidValues,createRaidLab,raidAct,raidComplete,restoreRaidLab} from '../src/raid-lab.js';

test('every one-bit erasure has one solution, while either two data bits have two',()=>{
 for(let a=0;a<2;a++)for(let b=0;b<2;b++){
  const original={a,b,p:a^b};
  for(const c of Object.values(raidCases)){
   const candidates=[];
   for(let x=0;x<2;x++)for(let y=0;y<2;y++)for(let p=0;p<2;p++){
    const bits={a:x,b:y,p};if(Object.keys(bits).every(k=>c.missing.includes(k)||bits[k]===original[k])&&raidValid(bits))candidates.push(bits);
   }
   assert.equal(candidates.length,c.missing.length===1?1:2);assert.ok(candidates.some(c=>Object.keys(original).every(k=>c[k]===original[k])));
  }
 }
});
test('candidate checks, reflection and replay require evidence rather than a guessed conclusion',()=>{
 let s=createRaidLab();const act=a=>{const r=raidAct(s,a);assert.equal(r.ok,true);s=r.state;};
 act('test');assert.deepEqual(s.seen,[]);assert.equal(raidAct(s,'toggle:b').ok,false);act('toggle:a');act('test');assert.deepEqual(s.seen,['a']);
 assert.deepEqual(restoreRaidLab(s),s);assert.throws(()=>restoreRaidLab({history:['toggle:b']}),RangeError);
 act('answer:ambiguous');act('check');assert.equal(raidComplete(s),false);assert.deepEqual(raidValues,{a:1,b:0,p:1});
});
