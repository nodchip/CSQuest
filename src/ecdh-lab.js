export const ecdhLabLevel={id:'castle-ecdh-lab',number:'603',kind:'ecdh-lab',name:'二つの塔の鍵交換',tag:'ECDH と中間者',title:'すり替えられた鍵を見抜こう',story:'ミラとリオの塔が秘密の伝令を交わします。途中に潜む影から、伝令を守りましょう。'};
export const ecdhLabCases={direct:'直接交換',intercept:'影が公開鍵を差し替え',authenticated:'確認済みの公開鍵と照合'};
const equal=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
export async function runEcdhLab(crypto,id){
 if(!crypto?.subtle||!Object.hasOwn(ecdhLabCases,id))throw new RangeError('条件が不正です。');
 const subtle=crypto.subtle,params={name:'ECDH',namedCurve:'P-256'};
 const [a,b,shadowA,shadowB]=await Promise.all(Array.from({length:4},()=>subtle.generateKey(params,false,['deriveBits'])));
 const attacked=id!=='direct',receivedA=attacked?shadowA.publicKey:b.publicKey,receivedB=attacked?shadowB.publicKey:a.publicKey;
 if(id==='authenticated'){
  const [received,known]=await Promise.all([subtle.exportKey('raw',receivedA),subtle.exportKey('raw',b.publicKey)]);
  return {rejected:!equal(new Uint8Array(received),new Uint8Array(known)),receiver:null,shadow:null,forwarded:null};
 }
 const bits=(privateKey,publicKey)=>subtle.deriveBits({name:'ECDH',public:publicKey},privateKey,256);
 const [aBits,bBits,shadowABits,shadowBBits]=await Promise.all([bits(a.privateKey,receivedA),bits(b.privateKey,receivedB),bits(shadowA.privateKey,a.publicKey),bits(shadowB.privateKey,b.publicKey)]);
 const salt=new Uint8Array(32),info=new TextEncoder().encode('CS Quest ECDH lesson');
 const key=async raw=>subtle.deriveKey({name:'HKDF',hash:'SHA-256',salt,info},await subtle.importKey('raw',raw,'HKDF',false,['deriveKey']),{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 const [ak,bk,sk,sbk]=await Promise.all([key(aBits),key(bBits),key(shadowABits),key(shadowBBits)]);
 const iv=crypto.getRandomValues(new Uint8Array(12)),message=new TextEncoder().encode('ABC');
 const encrypted=await subtle.encrypt({name:'AES-GCM',iv},ak,message);
 const decrypt=async k=>{try{return new Uint8Array(await subtle.decrypt({name:'AES-GCM',iv},k,encrypted));}catch(e){if(e.name==='OperationError')return null;throw e;}};
 const [received,stolen]=await Promise.all([decrypt(bk),decrypt(sk)]);
 let forwarded=false;
 if(stolen&&attacked){const iv2=crypto.getRandomValues(new Uint8Array(12));const relay=await subtle.encrypt({name:'AES-GCM',iv:iv2},sbk,stolen);const out=new Uint8Array(await subtle.decrypt({name:'AES-GCM',iv:iv2},bk,relay));forwarded=equal(out,message);}
 return {rejected:false,receiver:!!received&&equal(received,message),shadow:!!stolen&&equal(stolen,message),forwarded};
}
export function createEcdhLab(){return {selected:'direct',guess:null,tested:[],answer:null,checked:false};}
export function ecdhLabComplete(s){return Object.keys(ecdhLabCases).every(id=>s.tested.includes(id))&&s.answer==='authenticate'&&s.checked;}
export function restoreEcdhLab(s){
 if(!s||!Object.hasOwn(ecdhLabCases,s.selected)||![null,'shared','intercepted','rejected'].includes(s.guess)||!Array.isArray(s.tested)||new Set(s.tested).size!==s.tested.length||s.tested.some(id=>!Object.hasOwn(ecdhLabCases,id))||![null,'authenticate','secret','encrypt'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です。');
 return {...s,tested:[...s.tested]};
}
