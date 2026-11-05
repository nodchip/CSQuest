import test from 'node:test';
import assert from 'node:assert/strict';
import {createFuzz,fuzzFlip,fuzzOutcome,fuzzModelOutcome,fuzzComplete,restoreFuzz} from '../src/fuzz-symbolic.js';
test('three bit mutations reach all inputs and only six fails',()=>{for(let i=0;i<8;i++){for(let b=0;b<3;b++)assert.equal(fuzzFlip(fuzzFlip(i,b),b),i);assert.equal(fuzzOutcome(i),i===6?'故障':'正常');}assert.throws(()=>fuzzFlip(8,0));});
test('completion requires both observations and the full path condition; saved input is validated',()=>{const s=createFuzz();s.tested=[0,6];s.answer='ge6';s.checked=true;assert.equal(fuzzComplete(s),false);s.answer='ge6lt7';assert.equal(fuzzComplete(s),true);assert.deepEqual(restoreFuzz(s),s);assert.throws(()=>restoreFuzz({...s,tested:[6,6]}));});
test('an omitted branch makes an exhaustive model check miss a real observed fault',()=>{
 for(let i=0;i<8;i++)assert.equal(fuzzModelOutcome('faithful',i),fuzzOutcome(i));
 assert.deepEqual(Array.from({length:8},(_,i)=>i).filter(i=>fuzzModelOutcome('omitted',i)==='故障'),[]);
 assert.equal(fuzzOutcome(6),'故障');assert.equal(fuzzModelOutcome('omitted',6),'正常');
 assert.throws(()=>fuzzModelOutcome('unknown',0));assert.throws(()=>fuzzModelOutcome('omitted',8));
 const old={value:6,tested:[0,6],answer:'ge6lt7',checked:true};assert.equal(restoreFuzz(old).model,'faithful');assert.equal(restoreFuzz(old).modelChecked,false);
 assert.throws(()=>restoreFuzz({...old,model:'unknown'}));
});
