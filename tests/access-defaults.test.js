import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultDecision,defaultCreate,defaultCheck,defaultDone,defaultRestore} from '../src/access-defaults.js';

test('explicit entries agree and an unlisted visitor distinguishes the defaults',()=>{
 assert.deepEqual(['deny','allow'].map(p=>['healer','thief','unknown'].map(v=>defaultDecision(p,v))),[[true,false,false],[true,false,true]]);
 assert.throws(()=>defaultDecision('invalid','unknown'),RangeError);
});
test('wrong predictions do not count, all six trials and reflection survive restoring',()=>{
 let q=defaultCreate();q.answer='deny';defaultCheck(q);assert.equal(q.last.correct,false);assert.equal(q.seen.length,0);
 for(const p of ['deny','allow'])for(const v of ['healer','thief','unknown']){q.policy=p;q.visitor=v;q.answer=defaultDecision(p,v)?'allow':'deny';defaultCheck(q);}
 q=defaultRestore(q);assert.equal(q.seen.length,6);q.reflection='deny';q.checked=true;assert.equal(defaultDone(q),true);
 assert.throws(()=>defaultRestore({...q,last:{...q.last,correct:!q.last.correct}}),RangeError);
});
