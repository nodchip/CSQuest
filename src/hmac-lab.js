export const hmacLabLevel={id:'castle-hmac-lab',number:'601',kind:'hmac-lab',name:'伝令の指紋と秘密の印',tag:'SHA-256 と HMAC',title:'二つの印を計算して比べよう',story:'伝令の本文を変えた者が印も作り直せるとき、受け手は何を確かめられるでしょう。公開の指紋と鍵付きの印を比べましょう。'};
export const hmacLabModes={hash:'公開の SHA-256',hmac:'鍵付き HMAC-SHA-256'};
export const hmacLabActions={honest:'元の伝令',edit:'本文だけ変更',replace:'本文と印を変更',replay:'古い伝令を再送'};
export const hmacLabOriginal=new Uint8Array([0x41,0x42,0x43]);
export const hmacLabChanged=new Uint8Array([0x41,0x42,0x44]);
export async function runHmacLab(subtle,mode,action){
 if(!subtle||!Object.hasOwn(hmacLabModes,mode)||!Object.hasOwn(hmacLabActions,action))throw new RangeError('条件が不正です。');
 const changed=action==='edit'||action==='replace',body=changed?hmacLabChanged:hmacLabOriginal;
 const digest=async data=>new Uint8Array(await subtle.digest('SHA-256',data));
 if(mode==='hash'){
  const tag=await digest(action==='replace'?hmacLabChanged:hmacLabOriginal),expected=await digest(body);
  return {body,tag,expected,accepted:tag.length===expected.length&&tag.every((v,i)=>v===expected[i]),replayed:action==='replay'};
 }
 const importKey=raw=>subtle.importKey('raw',raw,{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
 const key=await importKey(new Uint8Array(32)),wrongRaw=new Uint8Array(32);wrongRaw[0]=1;
 const wrong=await importKey(wrongRaw),sign=async(k,data)=>new Uint8Array(await subtle.sign('HMAC',k,data));
 const tag=action==='replace'?await sign(wrong,hmacLabChanged):await sign(key,hmacLabOriginal);
 const expected=await sign(key,body),accepted=await subtle.verify('HMAC',key,tag,body);
 return {body,tag,expected,accepted,replayed:action==='replay'};
}
export function createHmacLab(){return {mode:'hash',action:'honest',guess:null,tested:[],answer:null,checked:false};}
export function hmacLabComplete(s){return Object.keys(hmacLabModes).every(m=>Object.keys(hmacLabActions).every(a=>s.tested.includes(`${m}:${a}`)))&&s.answer==='auth'&&s.checked;}
export function restoreHmacLab(saved){
 const valid=Object.keys(hmacLabModes).flatMap(m=>Object.keys(hmacLabActions).map(a=>`${m}:${a}`));
 if(!saved||!Object.hasOwn(hmacLabModes,saved.mode)||!Object.hasOwn(hmacLabActions,saved.action)||![null,true,false].includes(saved.guess)||!Array.isArray(saved.tested)||new Set(saved.tested).size!==saved.tested.length||saved.tested.some(id=>!valid.includes(id))||![null,'auth','secrecy','fresh'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...createHmacLab(),mode:saved.mode,action:saved.action,guess:saved.guess,tested:[...saved.tested],answer:saved.answer,checked:saved.checked};
}
