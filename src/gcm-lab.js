export const gcmLabLevel={id:'castle-gcm-lab',number:'600',kind:'gcm-lab',name:'伝令の封と一度きりの印',tag:'AES-GCM と認証付き暗号',title:'実際の封を比べよう',story:'城の伝令は封を閉じるたびに印を選びます。二通の封と改変された封を比べ、印と検証の役割を調べましょう。'};
export const gcmPlaintexts=[new Uint8Array([0,0,0,0]),new Uint8Array([1,2,3,4])];
export function bytesHex(data){return Array.from(data,x=>x.toString(16).padStart(2,'0')).join(' ');}
export async function runGcmLab(subtle,reuse,tamper){
 if(!subtle||typeof reuse!=='boolean'||typeof tamper!=='boolean')throw new TypeError('暗号の条件が不正です。');
 const key=await subtle.importKey('raw',new Uint8Array(16),{name:'AES-GCM'},false,['encrypt','decrypt']);
 const iv1=new Uint8Array(12),iv2=new Uint8Array(12);if(!reuse)iv2[11]=1;
 const enc=async(iv,data)=>new Uint8Array(await subtle.encrypt({name:'AES-GCM',iv,tagLength:128},key,data));
 const a=await enc(iv1,gcmPlaintexts[0]),b=await enc(iv2,gcmPlaintexts[1]);
 const cipherA=a.slice(0,4),cipherB=b.slice(0,4),xor=Uint8Array.from(cipherA,(v,i)=>v^cipherB[i]),plainXor=Uint8Array.from(gcmPlaintexts[0],(v,i)=>v^gcmPlaintexts[1][i]);
 const received=b.slice();if(tamper)received[0]^=1;
 let accepted,opened=null;try{opened=new Uint8Array(await subtle.decrypt({name:'AES-GCM',iv:iv2,tagLength:128},key,received));accepted=true;}catch(e){if(e?.name!=='OperationError')throw e;accepted=false;}
 return {cipherA,cipherB,tagA:a.slice(4),tagB:b.slice(4),xor,plainXor,sameXor:xor.every((v,i)=>v===plainXor[i]),accepted,opened};
}
export function createGcmLab(){return {reuse:true,tamper:false,xorGuess:null,acceptGuess:null,tested:[],answer:null,checked:false};}
export function gcmCaseId(reuse,tamper){return `${reuse?'same':'different'}:${tamper?'changed':'original'}`;}
export function gcmLabComplete(s){return [true,false].every(r=>[true,false].every(t=>s.tested.includes(gcmCaseId(r,t))))&&s.answer==='unique'&&s.checked;}
export function restoreGcmLab(saved){
 const valid=[true,false].flatMap(r=>[true,false].map(t=>gcmCaseId(r,t)));
 if(!saved||typeof saved.reuse!=='boolean'||typeof saved.tamper!=='boolean'||![null,true,false].includes(saved.xorGuess)||![null,true,false].includes(saved.acceptGuess)||!Array.isArray(saved.tested)||new Set(saved.tested).size!==saved.tested.length||saved.tested.some(x=>!valid.includes(x))||![null,'unique','encryptOnly','reuse'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...createGcmLab(),reuse:saved.reuse,tamper:saved.tamper,xorGuess:saved.xorGuess,acceptGuess:saved.acceptGuess,tested:[...saved.tested],answer:saved.answer,checked:saved.checked};
}
