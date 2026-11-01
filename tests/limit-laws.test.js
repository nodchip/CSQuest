import {test} from 'node:test';
import assert from 'node:assert/strict';
import {limitSizes,limitDistribution,limitDraw,createLimitLaws,limitLawsComplete,restoreLimitLaws} from '../src/limit-laws.js';

test('二項分布の係数、区間確率、正規化区間を独立に照合する',()=>{
 const expected={4:[14n,6n],16:[64142n,35750n],64:[18446294626682396558n,11405016903614965638n]};let row=[1n];
 for(let n=0;n<=64;n++){
  if(limitSizes.includes(n)){const d=limitDistribution(n);assert.deepEqual(d.counts,row);assert.equal(d.total,1n<<BigInt(n));assert.equal(d.bins.reduce((a,b)=>a+b,0n),d.total);assert.equal(d.near,expected[n][0]);assert.equal(d.standard,expected[n][1]);}
  row=[1n,...row.slice(1).map((v,i)=>v+row[i]),1n];
 }
});
test('乱数の各バイトの１ビットから表の数を得る',()=>{
 for(let mask=0;mask<16;mask++){const bytes=Uint8Array.from({length:4},(_,i)=>((mask>>i)&1)?255:254);assert.equal(limitDraw(4,bytes),mask.toString(2).replaceAll('0','').length);}
 assert.throws(()=>limitDraw(4,new Uint8Array(3)),RangeError);assert.throws(()=>limitDraw(3,new Uint8Array(3)),RangeError);
});
test('３回数での実験と３つの振り返りが必要で、記録を検証する',()=>{
 const s=createLimitLaws();s.samples={4:[2],16:[8],64:[32]};s.lln='near';s.clt='standard';s.finite='not-guaranteed';assert.equal(limitLawsComplete(s),false);s.checked=true;assert.equal(limitLawsComplete(s),true);
 const r=restoreLimitLaws(s);r.samples[4].push(1);assert.equal(s.samples[4].length,1);
 for(const p of [{n:8},{samples:{...s.samples,4:[5]}},{samples:{...s.samples,4:Array(11).fill(1)}},{lln:'bad'},{checked:1}])assert.throws(()=>restoreLimitLaws({...s,...p}),RangeError);
});
