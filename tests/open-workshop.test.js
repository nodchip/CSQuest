import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {openTerms,openActions,openOutcome,openRequired,openCreate,openInspect,openComplete,openRestore} from '../src/open-workshop.js';

test('four fictional terms produce the expected seven action outcomes',()=>{
 const expected={view:[true,true,false,false,false,false,false],noncommercial:[true,false,true,true,false,false,false],permissive:[true,true,true,true,true,false,true],reciprocal:[true,true,true,true,true,false,false]};
 for(const term of Object.keys(openTerms))assert.deepEqual(Object.keys(openActions).map(a=>openOutcome(term,a).allowed),expected[term]);
 assert.throws(()=>openOutcome('bad','study'));assert.throws(()=>openOutcome('view','bad'));
});
test('comparisons and both reflections are required and saved data are validated',()=>{
 const q=openCreate();for(const key of openRequired){[q.term,q.action]=key.split(':');openInspect(q);}q.definition='freedoms';q.obligations='none';assert.equal(openComplete(q),false);q.obligations='terms';assert.equal(openComplete(q),true);
 const copy=openRestore(q);copy.seen.pop();assert.equal(q.seen.length,openRequired.length);
 assert.throws(()=>openRestore({...q,last:'bad'}));assert.throws(()=>openRestore({...q,seen:['view:study','view:study']}));
});
