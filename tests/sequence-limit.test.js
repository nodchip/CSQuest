import test from 'node:test';
import assert from 'node:assert/strict';
import {limitWidths,limitCandidates,limitCheck,limitCreate,limitRestore,limitDone} from '../src/sequence-limit.js';
test('strict boundary and every later index for the reciprocal sequence',()=>{for(const k of limitWidths){assert.deepEqual(limitCandidates(k),[k,k+1,k+2]);assert.equal(limitCheck(k,k),false);for(const n of [k+1,k+2]){assert.equal(limitCheck(k,n),true);for(let i=n;i<n+100;i++)assert.ok(1/i<1/k);}}assert.throws(()=>limitCheck(3,4));assert.throws(()=>limitCheck(2,100));});
test('all three widths and the quantifier reflection are required and restored',()=>{const q=limitCreate();q.choices={2:3,5:6,10:11};q.reflection='every';assert.equal(limitDone(q),true);const copy=limitRestore(q);copy.choices[2]=2;assert.equal(limitDone(copy),false);assert.equal(q.choices[2],3);assert.equal(limitDone({...q,reflection:'one'}),false);assert.throws(()=>limitRestore({...q,choices:{2:4,5:8}}));});
