import test from 'node:test';
import assert from 'node:assert/strict';
import {klmSequence,klmTime,klmKeys,klmCreate,klmCheck,klmComplete,klmRestore} from '../src/klm-workshop.js';

test('specified operations and illustrative tenths of seconds give the four independent expected totals',()=>{
 const expected={'fast:menu':[['M','P','K','P','K'],38],'fast:keys':[['M','K','K'],16],'slow:menu':[['M','P','K','P','K'],38],'slow:keys':[['M','K','K','R'],46]};
 for(const [key,[sequence,total]] of Object.entries(expected)){assert.deepEqual(klmSequence(...key.split(':')),sequence);assert.equal(klmTime(sequence),total);}
 assert.throws(()=>klmSequence('bad','menu'),RangeError);assert.throws(()=>klmTime(['M','X']),RangeError);
});
test('all four checked predictions and reflection required; saved prefixes and results are validated',()=>{
 const q=klmCreate();q.answer=38;assert.throws(()=>klmCheck(q),RangeError);
 for(const key of klmKeys){[q.mode,q.method]=key.split(':');q.runs[key]=klmSequence(q.mode,q.method);q.answer=klmTime(q.runs[key]);klmCheck(q);}
 assert.equal(klmComplete(q),false);q.reflection='limited';assert.equal(klmComplete(q),true);const copy=klmRestore(q);copy.runs['fast:menu'].pop();assert.equal(q.runs['fast:menu'].length,5);
 assert.throws(()=>klmRestore({...q,runs:{...q.runs,'fast:menu':['K']}}),RangeError);assert.throws(()=>klmRestore({...q,last:{...q.last,correct:false}}),RangeError);
});
