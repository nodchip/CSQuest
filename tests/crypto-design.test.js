import test from 'node:test';
import assert from 'node:assert/strict';
import {cryptoDesignCases,shiftCipherValue,candidateMatches,createCryptoDesign,restoreCryptoDesign,cryptoDesignComplete} from '../src/crypto-design.js';
test('six-position rotation is correct and known pairs uniquely reveal each toy key',()=>{
 for(let m=0;m<6;m++)for(let k=0;k<6;k++)assert.equal(shiftCipherValue(m,k),Array.from({length:k},(_,i)=>(m+i+1)%6).at(-1)??m);
 for(const [id,c] of Object.entries(cryptoDesignCases)){const matches=Array.from({length:6},(_,k)=>k).filter(k=>candidateMatches(id,k));assert.deepEqual(matches,[id==='first'?3:5]);assert.equal(shiftCipherValue(c.plain,matches[0]),c.cipher);}
});
test('each case requires a correct and an incorrect tested key, review and restore',()=>{
 const s=createCryptoDesign();s.trials.first={tested:[3],guess:3,checked:true};s.trials.rotated={tested:[0,5],guess:5,checked:true};s.choice='reviewed';s.answer='keys';s.checked=true;assert.equal(cryptoDesignComplete(s),false);
 s.trials.first.tested.push(0);assert.ok(cryptoDesignComplete(restoreCryptoDesign(s)));assert.throws(()=>restoreCryptoDesign({...s,trials:{...s.trials,first:{tested:[3,3],guess:3,checked:true}}}));
});
