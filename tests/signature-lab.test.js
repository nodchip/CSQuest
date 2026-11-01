import {test} from 'node:test';
import assert from 'node:assert/strict';
import {signatureScan,createSignatureLab,signatureAct,signatureComplete,restoreSignatureLab} from '../src/signature-lab.js';
test('the old and updated definitions detect known marks but also quarantine a harmless matching example',()=>{
 assert.deepEqual(signatureScan('new','old'),{alert:false,harmful:true,quarantined:false});
 assert.deepEqual(signatureScan('new','updated'),{alert:true,harmful:true,quarantined:true});
 for(const version of ['old','updated']){assert.deepEqual(signatureScan('known',version),{alert:true,harmful:true,quarantined:true});assert.deepEqual(signatureScan('safe',version),{alert:true,harmful:false,quarantined:true});}
 assert.throws(()=>signatureScan('unknown','old'),RangeError);
});
test('scan history restores and a conclusion alone is insufficient',()=>{
 let s=createSignatureLab();for(const action of ['file:new','scan','answer:safe','check'])s=signatureAct(s,action).state;
 assert.equal(signatureComplete(s),false);assert.deepEqual(restoreSignatureLab(s),s);assert.throws(()=>restoreSignatureLab({history:['file:bad']}),RangeError);
});
