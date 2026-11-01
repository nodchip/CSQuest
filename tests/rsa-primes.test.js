import test from 'node:test';
import assert from 'node:assert/strict';
import {modularPower} from '../src/homomorphic-product.js';
import {rsaPrimeFacts,rsaPrimeAnswers,createRsaPrimes,rsaPrimeStep,rsaPrimesComplete,restoreRsaPrimes} from '../src/rsa-primes.js';
test('toy parameters recover all residues and bad exponent has a collision',()=>{
 const f=rsaPrimeFacts();assert.deepEqual(f,{n:55,phi:40,publicExponent:3,privateExponent:27,cipher:23,opened:12,badA:32,badB:32});
 for(let m=0;m<55;m++)assert.equal(modularPower(modularPower(m,3,55),27,55),m);
 const coprimes=Array.from({length:55},(_,i)=>i).filter(x=>x%5!==0&&x%11!==0);assert.equal(coprimes.length,40);
});
test('wrong answers do not advance, bad exponent must be tried, and resume is validated',()=>{
 let s=createRsaPrimes();assert.equal(rsaPrimeStep(s,'factors:3,11').history.length,0);
 s=rsaPrimeStep(s,rsaPrimeAnswers[0]);s=rsaPrimeStep(s,rsaPrimeAnswers[1]);assert.equal(rsaPrimeStep(s,'exponent:3').history.length,2);
 s=rsaPrimeStep(s,'exponent:5');for(const action of rsaPrimeAnswers.slice(2))s=rsaPrimeStep(s,action);
 assert.equal(rsaPrimesComplete(s),false);s.answer='factors';s.checked=true;assert.ok(rsaPrimesComplete(restoreRsaPrimes(s)));
 assert.throws(()=>restoreRsaPrimes({...s,badSeen:false}));assert.throws(()=>restoreRsaPrimes({...s,history:['phi:40']}));
});
