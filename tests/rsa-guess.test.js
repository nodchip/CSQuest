import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rsaGuessResult,createRsaGuess,rsaGuessComplete,restoreRsaGuess} from '../src/rsa-guess.js';
test('public encryption identifies both targets from the four candidates',()=>{
 assert.deepEqual([1,2,3,4].map(n=>rsaGuessResult('first',n).ciphertext),[1,8,27,9]);assert.deepEqual([1,2,3,4].filter(n=>rsaGuessResult('first',n).match),[3]);assert.deepEqual([1,2,3,4].filter(n=>rsaGuessResult('second',n).match),[4]);assert.throws(()=>rsaGuessResult('first',5),RangeError);
});
test('both matches must be actually tried and the restored history is independent',()=>{
 const s=createRsaGuess();s.history.first=[1,3];s.history.second=[4];const copy=restoreRsaGuess(s);assert.equal(rsaGuessComplete(copy),true);s.history.second=[];assert.equal(rsaGuessComplete(s),false);assert.throws(()=>restoreRsaGuess({...s,history:{first:[7],second:[]}}),RangeError);
});
