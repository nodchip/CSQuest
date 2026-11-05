import test from 'node:test';
import assert from 'node:assert/strict';
import {crcEncode,crcDivision,crcOriginal,createCrcLab,crcLabAct,crcLabComplete,crcReceived,restoreCrcLab,crcBitXorCount} from '../src/crc-lab.js';

const number=bits=>bits.reduce((n,b)=>(n<<1)|b,0);
function remainder(n){for(let bit=6;bit>=3;bit--)if(n&(1<<bit))n^=0b1011<<(bit-3);return n;}
test('bit XOR count follows each taken division step for all seven-bit inputs',()=>{for(let word=0;word<128;word++){let n=word,taken=0;for(let bit=6;bit>=3;bit--){if(n&(1<<bit)){taken++;n^=0b1011<<(bit-3);}}const bits=[6,5,4,3,2,1,0].map(i=>(word>>i)&1);assert.equal(crcBitXorCount(bits),taken*4);}assert.throws(()=>crcBitXorCount([0]));});
test('CRC encoding and all one- and two-bit errors agree with independent polynomial division',()=>{
 assert.equal(number(crcOriginal),0b0101100);
 for(let data=0;data<16;data++){
  const bits=[3,2,1,0].map(i=>(data>>i)&1),encoded=crcEncode(bits),word=number(encoded);
  assert.deepEqual(encoded.slice(0,4),bits);assert.equal(remainder(word),0);
  for(let a=0;a<7;a++){
   assert.notEqual(remainder(word^(1<<a)),0);
   for(let b=a+1;b<7;b++)assert.notEqual(remainder(word^(1<<a)^(1<<b)),0);
  }
  for(let error=0;error<128;error++)assert.equal(number(crcDivision([6,5,4,3,2,1,0].map(i=>((word^error)>>i)&1)).at(-1)),remainder(word^error));
  assert.equal(remainder(word^0b0001011),0);
 }
});
test('the interactive division rejects wrong steps and restores its history',()=>{
 let state=createCrcLab();const act=a=>{const r=crcLabAct(state,a);assert.equal(r.ok,true);state=r.state;};
 act('start');assert.equal(crcLabAct(state,'step:xor').ok,false);act('step:skip');assert.deepEqual(restoreCrcLab(state),state);
 while(state.stage<4){const bit=crcDivision(crcReceived(state))[state.stage][state.stage];act(bit?'step:xor':'step:skip');}
 assert.deepEqual(state.seen,['clean']);assert.equal(crcLabAct(state,'step:skip').ok,false);assert.equal(crcLabComplete(state),false);
 assert.throws(()=>restoreCrcLab({history:['start','step:xor']}),RangeError);
 assert.throws(()=>crcEncode([0,1]),RangeError);
});
