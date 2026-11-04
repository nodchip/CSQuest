import test from 'node:test';
import assert from 'node:assert/strict';
import {deutschCases,deutschTrace,deutschCreate,deutschCheck,deutschDone,deutschRestore} from '../src/deutsch-interferometer.js';
test('all one-bit functions yield their parity and global phase does not change probabilities',()=>{
 for(const [id,c] of Object.entries(deutschCases)){const t=deutschTrace(id),expected=c.values[0]^c.values[1];assert.ok(Math.abs(t.probabilities[expected]-1)<1e-12);assert.ok(Math.abs(t.probabilities[1-expected])<1e-12);}
 for(const [a,b] of [['A','D'],['B','C']]){const p=deutschTrace(a).probabilities,q=deutschTrace(b).probabilities;for(let i=0;i<2;i++)assert.ok(Math.abs(p[i]-q[i])<1e-12);}
 assert.throws(()=>deutschTrace('other'),RangeError);
});
test('a classical query and correct quantum result for all four cases plus reflection are required',()=>{
 const q=deutschCreate();assert.throws(()=>deutschCheck(q),RangeError);
 for(const [id,c] of Object.entries(deutschCases)){q.selected=id;q.phase='oracle';q.classical[id]=0;q.prediction=1-(c.values[0]^c.values[1]);assert.equal(deutschCheck(q),false);q.prediction=c.values[0]^c.values[1];assert.equal(deutschCheck(q),true);}
 assert.equal(deutschDone(q),false);q.reflection='queries';assert.equal(deutschDone(deutschRestore(q)),true);
 const copy=deutschRestore(q);copy.seen.pop();assert.equal(q.seen.length,4);assert.throws(()=>deutschRestore({...q,seen:['A','A']}),RangeError);
});
