export const ecdsaLabLevel={id:'castle-ecdsa-lab',number:'602',kind:'ecdsa-lab',name:'二つの塔の本物の署名',tag:'ECDSA と公開鍵の検証',title:'署名と公開鍵の持ち主を確かめよう',story:'ミラの塔から届いた伝令の署名を、公開鍵で確かめます。別の鍵の伝令や古い伝令も見分けられるでしょうか。'};
export const ecdsaLabCases={honest:'元の伝令',body:'本文を変更',signature:'署名を変更',wrongKey:'別の公開鍵で検証',substituted:'別人の署名と公開鍵に差替え',replay:'古い伝令を再送'};
export async function runEcdsaLab(subtle,id){
 if(!subtle||!Object.hasOwn(ecdsaLabCases,id))throw new RangeError('条件が不正です。');
 const params={name:'ECDSA',namedCurve:'P-256'},sigParams={name:'ECDSA',hash:'SHA-256'};
 const mira=await subtle.generateKey(params,false,['sign','verify']),other=await subtle.generateKey(params,false,['sign','verify']);
 const original=new Uint8Array([0x41,0x42,0x43]),modified=new Uint8Array([0x41,0x42,0x44]);
 const signing=id==='substituted'?other:mira,verification=(id==='wrongKey'||id==='substituted')?other:mira;
 const signature=new Uint8Array(await subtle.sign(sigParams,signing.privateKey,original));
 if(id==='signature')signature[0]^=1;
 const body=id==='body'?modified:original,previouslyAccepted=id==='replay'?await subtle.verify(sigParams,verification.publicKey,signature,body):null;
 const verified=await subtle.verify(sigParams,verification.publicKey,signature,body);
 return {body,signature,verified,trustedKey:verification===mira,replayed:id==='replay',previouslyAccepted};
}
export function createEcdsaLab(){return {selected:'honest',verifyGuess:null,trustGuess:null,tested:[],answer:null,checked:false};}
export function ecdsaLabComplete(s){return Object.keys(ecdsaLabCases).every(id=>s.tested.includes(id))&&s.answer==='binding'&&s.checked;}
export function restoreEcdsaLab(saved){
 if(!saved||!Object.hasOwn(ecdsaLabCases,saved.selected)||![null,true,false].includes(saved.verifyGuess)||![null,true,false].includes(saved.trustGuess)||!Array.isArray(saved.tested)||new Set(saved.tested).size!==saved.tested.length||saved.tested.some(id=>!Object.hasOwn(ecdsaLabCases,id))||![null,'binding','encrypt','fresh'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...createEcdsaLab(),selected:saved.selected,verifyGuess:saved.verifyGuess,trustGuess:saved.trustGuess,tested:[...saved.tested],answer:saved.answer,checked:saved.checked};
}
