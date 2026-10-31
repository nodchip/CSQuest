import test from 'node:test';
import assert from 'node:assert/strict';
import {signatureKeys,signatureCases,verifySignature,signatureCorrect,createSignature,restoreSignature,signatureComplete} from '../src/signatures.js';
test('verification checks both the signer key and exact message',()=>{
 assert.equal(verifySignature('intact','mira'),true);assert.equal(verifySignature('modified','mira'),false);assert.equal(verifySignature('wrongkey','nono'),false);assert.equal(verifySignature('other','nono'),true);assert.equal(verifySignature('other','mira'),false);
 for(const [id,item] of Object.entries(signatureCases))for(const key of Object.keys(signatureKeys))assert.equal(verifySignature(id,key),item.signer===key&&item.text===item.signedText);
});
test('a successful verification by another key does not identify Mira; all trials and predictions required',()=>{
 const s=createSignature();for(const [id,item] of Object.entries(signatureCases)){const key=item.requiredKey,valid=verifySignature(id,key);s.choices[id]={key,prediction:valid?'valid':'invalid',mira:valid&&key==='mira'?'yes':'no',checked:true};assert.equal(signatureCorrect(id,s.choices[id]),true);}assert.equal(signatureComplete(s),true);const copy=restoreSignature(s);s.choices.other.mira='yes';assert.equal(signatureComplete(s),false);assert.equal(copy.choices.other.mira,'no');copy.choices.other.key='bad';assert.throws(()=>restoreSignature(copy),RangeError);
});
