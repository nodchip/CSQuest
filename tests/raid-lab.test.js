import test from 'node:test';
import assert from 'node:assert/strict';
import {raidValid,raidCases,raidValues,raidStripes,createRaidLab,raidAct,raidComplete,restoreRaidLab} from '../src/raid-lab.js';

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
test('rotating parity reconstructs every lost disk in every stripe',()=>{
 assert.deepEqual(raidStripes.map(row=>row.findIndex(cell=>cell.kind==='parity')),[2,1,0]);
 for(const row of raidStripes){assert.equal(row.filter(cell=>cell.kind==='parity').length,1);assert.equal(row.reduce((n,cell)=>n^cell.bit,0),0);
  for(let disk=0;disk<3;disk++){const others=row.reduce((n,cell,i)=>i===disk?n:n^cell.bit,0);assert.equal(others,row[disk].bit);}
 }
 let s=createRaidLab();const act=a=>{const r=raidAct(s,a);assert.equal(r.ok,true);s=r.state;};
 act('rebuild');assert.ok(!s.seen.includes('disk:0'));for(let disk=0;disk<3;disk++){act(`disk:${disk}`);for(let row=0;row<3;row++)if(s.stripeGuesses[row]!==raidStripes[row][disk].bit)act(`stripe:${row}`);act('rebuild');}
 assert.ok(['disk:0','disk:1','disk:2'].every(k=>s.seen.includes(k)));assert.deepEqual(restoreRaidLab(s),s);
});
test('candidate checks, reflection and replay require evidence rather than a guessed conclusion',()=>{
 let s=createRaidLab();const act=a=>{const r=raidAct(s,a);assert.equal(r.ok,true);s=r.state;};
 act('test');assert.deepEqual(s.seen,[]);assert.equal(raidAct(s,'toggle:b').ok,false);act('toggle:a');act('test');assert.deepEqual(s.seen,['a']);
 assert.deepEqual(restoreRaidLab(s),s);assert.throws(()=>restoreRaidLab({history:['toggle:b']}),RangeError);
 act('answer:ambiguous');act('check');assert.equal(raidComplete(s),false);assert.deepEqual(raidValues,{a:1,b:0,p:1});
});
