import test from 'node:test';
import assert from 'node:assert/strict';
import {hammingEncode,hammingSyndrome,flipHamming,receivedHamming,hammingTarget,hammingCorrect,createHamming,restoreHamming,hammingComplete} from '../src/hamming.js';

test('all 16 messages correct every single-bit error and miscorrect every double-bit error under a single-error assumption',()=>{
  for(let value=0;value<16;value++){
    const data=[3,2,1,0].map(bit=>(value>>bit)&1),code=hammingEncode(data);assert.equal(hammingSyndrome(code),0);assert.deepEqual([code[2],code[4],code[5],code[6]],data);
    for(let a=1;a<=7;a++){const damaged=flipHamming(code,a);assert.equal(hammingSyndrome(damaged),a);assert.deepEqual(flipHamming(damaged,a),code);
      for(let b=a+1;b<=7;b++){const twice=flipHamming(damaged,b),syndrome=hammingSyndrome(twice);assert.equal(syndrome,a^b);assert.notEqual(syndrome,0);const guessed=flipHamming(twice,syndrome);assert.equal(hammingSyndrome(guessed),0);assert.notDeepEqual(guessed,code);}
    }
  }
});
test('the fixed examples require the proposed correction and recognizing uncertainty',()=>{
  const state=createHamming();assert.equal(hammingSyndrome(receivedHamming('single')),6);assert.equal(hammingSyndrome(receivedHamming('double')),6);state.choices.single={bits:hammingTarget('single'),tested:true,answer:''};state.choices.double={bits:hammingTarget('double'),tested:true,answer:'certain'};assert.equal(hammingCorrect('double',state.choices.double),false);assert.equal(hammingComplete(state),false);state.choices.double.answer='uncertain';assert.equal(hammingComplete(state),true);
  const restored=restoreHamming(state);state.choices.single.bits[0]^=1;assert.notDeepEqual(restored.choices.single.bits,state.choices.single.bits);assert.throws(()=>restoreHamming({...restored,choices:{...restored.choices,single:{bits:[1],tested:true,answer:''}}}),RangeError);
});
