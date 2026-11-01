import test from 'node:test';
import assert from 'node:assert/strict';
import {gfMultiply,mixColumn,inverseMixColumn,aesMixInputs,mixTerms,createAesMix,aesMixComplete,restoreAesMix} from '../src/aes-mix.js';
const polynomialProduct=(a,b)=>{let v=0;for(let i=0;i<8;i++)if(b&(1<<i))v^=a<<i;for(let i=14;i>=8;i--)if(v&(1<<i))v^=0x11b<<(i-8);return v;};
test('all 65536 field products agree with independent carryless polynomial reduction',()=>{
 for(let a=0;a<256;a++)for(let b=0;b<256;b++)assert.equal(gfMultiply(a,b),polynomialProduct(a,b));
 assert.equal(gfMultiply(0x57,0x13),0xfe);
});
test('FIPS column, inverse and single bit change in all four output bytes',()=>{
 assert.deepEqual(mixColumn(aesMixInputs.original),[0x04,0x66,0x81,0xe5]);
 const x=mixColumn(aesMixInputs.original),y=mixColumn(aesMixInputs.flipped);assert.equal(x.filter((v,i)=>v!==y[i]).length,4);
 for(const input of Object.values(aesMixInputs)){assert.deepEqual(inverseMixColumn(mixColumn(input)),input);for(let row=0;row<4;row++)assert.equal(mixTerms(input===aesMixInputs.original?'original':'flipped',row).reduce((acc,t)=>acc^t.value,0),mixColumn(input)[row]);}
 for(let bit=0;bit<32;bit++){const a=[0,0,0,0];a[Math.floor(bit/8)]=1<<(bit%8);assert.deepEqual(inverseMixColumn(mixColumn(a)),a);}
});
test('all eight outputs, difference and reflection are required; corrupt drafts fail',()=>{
 const s=createAesMix();s.solved=['original0','original1','original2','original3','flipped0','flipped1','flipped2','flipped3'];s.deltaGuess=4;s.deltaChecked=true;s.answer='diffusion';s.checked=true;assert.ok(aesMixComplete(restoreAesMix(s)));
 assert.throws(()=>restoreAesMix({...s,solved:['original0','original0']}));assert.throws(()=>restoreAesMix({...s,row:4}));
});
