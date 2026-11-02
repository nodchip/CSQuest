import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pedSealValue,pedSealCreate,pedSealTry,pedSealComplete,pedSealRestore} from '../src/pedersen-seal.js';

test('all three secrets give the same uniform distribution and exactly one opening of the target',()=>{
 const sets=[];for(let m=0;m<3;m++){const values=Array.from({length:11},(_,r)=>pedSealValue(m,r));for(let r=0;r<11;r++)assert.equal(values[r],Number((2n**BigInt(m)*3n**BigInt(r))%23n));assert.equal(new Set(values).size,11);sets.push([...values].sort((a,b)=>a-b));}assert.deepEqual(sets[0],sets[1]);assert.deepEqual(sets[1],sets[2]);assert.deepEqual([0,1,2].map(m=>Array.from({length:11},(_,r)=>r).filter(r=>pedSealValue(m,r)===1)),[[0],[4],[8]]);
});
test('completion requires distributions, a rejection, three openings and both conclusions; restore checks evidence',()=>{
 const q=pedSealCreate();for(let m=0;m<3;m++){q.m=m;q.seen[m]=true;q.r=[0,4,8][m];assert.equal(pedSealTry(q),1);assert.deepEqual(pedSealRestore(q),q);}q.hide='same';q.binding='small';assert.equal(pedSealComplete(q),false);q.m=0;q.r=1;assert.notEqual(pedSealTry(q),1);assert.equal(pedSealComplete(q),true);assert.deepEqual(pedSealRestore(q),q);const bad=structuredClone(q);bad.openings[1]=3;assert.throws(()=>pedSealRestore(bad));bad.openings[1]=4;bad.bad={m:0,r:0};assert.throws(()=>pedSealRestore(bad));
});
