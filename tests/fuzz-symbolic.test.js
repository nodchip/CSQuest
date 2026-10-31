import test from 'node:test';
import assert from 'node:assert/strict';
import {createFuzz,fuzzFlip,fuzzOutcome,fuzzComplete,restoreFuzz} from '../src/fuzz-symbolic.js';
test('three bit mutations reach all inputs and only six fails',()=>{for(let i=0;i<8;i++){for(let b=0;b<3;b++)assert.equal(fuzzFlip(fuzzFlip(i,b),b),i);assert.equal(fuzzOutcome(i),i===6?'故障':'正常');}assert.throws(()=>fuzzFlip(8,0));});
test('completion requires both observations and the full path condition; saved input is validated',()=>{const s=createFuzz();s.tested=[0,6];s.answer='ge6';s.checked=true;assert.equal(fuzzComplete(s),false);s.answer='ge6lt7';assert.equal(fuzzComplete(s),true);assert.deepEqual(restoreFuzz(s),s);assert.throws(()=>restoreFuzz({...s,tested:[6,6]}));});
