import test from 'node:test';
import assert from 'node:assert/strict';
import {enclaveModes,enclaveReplay,enclaveCreate,enclaveRestore,enclaveDone} from '../src/enclave-boundary.js';
const paths={direct:['validate','change','use'],copy:['copy','validate','change','use'],raw:['compute','export'],threshold:['compute','export']};
test('outside change affects a reread but not the already copied and validated value',()=>{
 const a=enclaveReplay('direct',paths.direct),b=enclaveReplay('copy',paths.copy);assert.equal(a.outside,9);assert.equal(a.used,9);assert.equal(b.outside,9);assert.equal(b.inside,3);assert.equal(b.used,3);assert.equal(a.done,true);assert.equal(b.done,true);
 assert.throws(()=>enclaveReplay('direct',['change']));assert.throws(()=>enclaveReplay('copy',['validate']));assert.throws(()=>enclaveReplay('copy',['copy','validate','use']));assert.throws(()=>enclaveReplay('direct',['copy']));
});
test('the external output differs from the protected internal value and still conveys information',()=>{
 assert.equal(enclaveReplay('raw',paths.raw).output,42);assert.equal(enclaveReplay('threshold',paths.threshold).output,'はい');assert.throws(()=>enclaveReplay('raw',['export']));assert.throws(()=>enclaveReplay('threshold',['compute','export','export']));
});
test('all four trials and both conclusions are required, with independent verified drafts',()=>{
 const q=enclaveCreate();for(const k of Object.keys(enclaveModes))q.histories[k]=[...paths[k]];q.inputReflection='copy';q.outputReflection='limited';assert.equal(enclaveDone(q),true);for(const k of Object.keys(enclaveModes))assert.equal(enclaveDone({...q,histories:{...q.histories,[k]:[]}}),false);assert.equal(enclaveDone({...q,inputReflection:'trust'}),false);assert.equal(enclaveDone({...q,outputReflection:'nothing'}),false);
 const restored=enclaveRestore(q);restored.histories.copy.pop();assert.equal(q.histories.copy.length,4);assert.throws(()=>enclaveRestore({...q,histories:{...q.histories,copy:['validate']}}));
});
