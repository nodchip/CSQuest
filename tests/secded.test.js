import test from 'node:test';
import assert from 'node:assert/strict';
import {hammingEncode,flipHamming,receivedHamming} from '../src/hamming.js';
import {secdedModes,secdedStatus,secdedCorrect,createSecded,restoreSecded,secdedComplete} from '../src/secded.js';
import {crcLabAct,crcDivision,crcReceived} from '../src/crc-lab.js';

test('the extended code distinguishes all single and double errors under the two-error assumption',()=>{
 for(let value=0;value<16;value++){
  const code=hammingEncode([3,2,1,0].map(bit=>(value>>bit)&1)),parity=code.reduce((a,b)=>a^b,0);assert.deepEqual(secdedStatus(code,parity),{syndrome:0,parity:0,diagnosis:'none'});
  for(let a=1;a<=8;a++){
   const first=a===8?code:flipHamming(code,a),checkA=a===8?parity^1:parity,result=secdedStatus(first,checkA);assert.equal(result.parity,1);assert.equal(result.syndrome,a===8?0:a);assert.equal(result.diagnosis,a===8?'overall':'single');
   for(let b=a+1;b<=8;b++){const second=b===8?first:flipHamming(first,b),checkB=b===8?checkA^1:checkA,r=secdedStatus(second,checkB);assert.equal(r.parity,0);assert.notEqual(r.syndrome,0);assert.equal(r.diagnosis,'double');}
  }
 }
});
test('all four trials need the specified corruption and correct receiver decision',()=>{
 const state=createSecded();for(const mode of Object.keys(secdedModes))for(const id of ['single','double']){const choice=state.choices[mode][id];choice.bits=receivedHamming(id);choice.checked=true;choice.answer=mode==='plain'?'unknown':id==='single'?'fix':'stop';assert.equal(secdedCorrect(mode,id,choice),true);}assert.equal(secdedComplete(state),false);
 const act=a=>{const result=crcLabAct(state.crc,a);assert.equal(result.ok,true);state.crc=result.state;};
 const divide=()=>{act('start');for(let i=0;i<4;i++){const work=crcDivision(crcReceived(state.crc))[state.crc.stage];act(work[i]?'step:xor':'step:skip');}};
 divide();act('flip:1');divide();act('flip:2');divide();act('flip:1');act('flip:2');for(const i of [4,6,7])act(`flip:${i}`);divide();act('answer:limits');act('check');
 assert.equal(secdedComplete(state),true);const copy=restoreSecded(state);assert.equal(secdedComplete(copy),true);state.choices.plain.single.bits[0]^=1;assert.notDeepEqual(copy.choices.plain.single.bits,state.choices.plain.single.bits);copy.choices.extended.double.answer='fix';assert.equal(secdedComplete(copy),false);assert.throws(()=>restoreSecded({...copy,mode:'bad'}),RangeError);
 const old={...state};delete old.crc;assert.deepEqual(restoreSecded(old).crc.history,[]);
});
