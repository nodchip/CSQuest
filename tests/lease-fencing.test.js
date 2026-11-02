import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fencingActions,fencingInitial,fencingExecute,fencingReplay,fencingCreate,fencingStep,fencingComplete,fencingRestore} from '../src/lease-fencing.js';

for(const policy of ['open','fenced'])for(const order of ['oldFirst','newFirst'])test(`${policy} / ${order}: both request orders`,()=>{
 const s=fencingInitial(policy,order),h=[];for(const a of ['issueA','expire','issueB']){for(const wrong of Object.keys(fencingActions).filter(x=>x!==a))assert.throws(()=>fencingExecute(structuredClone(s),wrong));fencingExecute(s,a);h.push(a);assert.deepEqual(fencingReplay(policy,order,h),s);}assert.equal(s.holder,'B');assert.equal(s.highest,0);
 const sequence=order==='oldFirst'?['A','B']:['B','A'];for(const who of sequence){const expected=who==='A'&&policy==='fenced'&&order==='newFirst'?'reject':'accept',op=`deliver${who}`;assert.throws(()=>fencingExecute(structuredClone(s),`${op}:${expected==='accept'?'reject':'accept'}`));fencingExecute(s,`${op}:${expected}`);h.push(`${op}:${expected}`);assert.deepEqual(fencingReplay(policy,order,h),s);}assert.equal(s.stage,'done');assert.equal(s.responses.A,policy==='fenced'&&order==='newFirst'?'reject':'accept');assert.equal(s.responses.B,'accept');assert.equal(s.value,policy==='open'&&order==='newFirst'?'A':'B');assert.equal(s.highest,2);
});
test('all four comparisons and the storage ordering reflection are required',()=>{
 const q=fencingCreate();for(const p of ['open','fenced'])for(const o of ['oldFirst','newFirst']){q.policy=p;q.order=o;const a=['issueA','expire','issueB',...(o==='oldFirst'?['deliverA:accept','deliverB:accept']:[ 'deliverB:accept',`deliverA:${p==='fenced'?'reject':'accept'}`])];for(const step of a){fencingStep(q,step);assert.deepEqual(fencingRestore(q),q);}}assert(!fencingComplete(q));q.answer='seen';assert(fencingComplete(q));const bad=structuredClone(q);bad.trials['fenced:newFirst'][4]='deliverA:accept';assert.throws(()=>fencingRestore(bad));
});
