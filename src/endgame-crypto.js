const message='灯りを届けて';
export const digestMessages=['花が咲いた','花が咲いた','花が咲いた！'];
const hex=bytes=>Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
const unhex=text=>Uint8Array.from(text.match(/../g),x=>parseInt(x,16));
function provider(){if(!globalThis.crypto?.subtle||!globalThis.crypto?.getRandomValues)throw Error('Web Crypto unavailable');return globalThis.crypto;}
export async function makeDemoPacket(){
 const c=provider(),raw=c.getRandomValues(new Uint8Array(16)),iv=c.getRandomValues(new Uint8Array(12));
 const key=await c.subtle.importKey('raw',raw,'AES-GCM',false,['encrypt']);
 const ciphertext=await c.subtle.encrypt({name:'AES-GCM',iv,tagLength:128},key,new TextEncoder().encode(message));
 return {key:hex(raw),iv:hex(iv),ciphertext:hex(new Uint8Array(ciphertext))};
}
export async function openDemoPacket(packet,{wrong=false,modified=false}={}){
 const c=provider(),raw=unhex(packet.key),iv=unhex(packet.iv),bytes=unhex(packet.ciphertext);if(wrong)raw[0]^=1;if(modified)bytes[0]^=1;
 const key=await c.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);
 try{const result=await c.subtle.decrypt({name:'AES-GCM',iv,tagLength:128},key,bytes);return {ok:true,text:new TextDecoder().decode(result)};}
 catch(error){if(error.name==='OperationError')return {ok:false};throw error;}
}
export async function demoDigest(index){const c=provider(),value=digestMessages[index];if(value===undefined)throw Error('invalid message');return hex(new Uint8Array(await c.subtle.digest('SHA-256',new TextEncoder().encode(value))));}
export function replayCrypto(kind,history){
 if(!['encrypt','digest','integrity'].includes(kind)||!Array.isArray(history))return null;
 let packet=null,wrong=false,right=false,modified=false,changed=false,digests=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind==='digest'){
   const m=/^digest:([0-2]):([0-9a-f]{64})$/.exec(action);if(m&&Number(m[1])===digests.length){digests.push(m[2]);continue;}
   if(action==='finish'&&digests.length===3&&digests[0]===digests[1]&&digests[0]!==digests[2]){done=true;continue;}return null;
  }
  const m=/^sealed:([0-9a-f]{32}):([0-9a-f]{24}):([0-9a-f]{34,512})$/.exec(action);
  if(m&&!packet&&m[3].length%2===0){packet={key:m[1],iv:m[2],ciphertext:m[3]};continue;}
  if(!packet)return null;
  if(kind==='encrypt'){
   if(action==='wrong'&&!wrong){wrong=true;continue;}
   if(action==='right'&&wrong&&!right){right=true;continue;}
   if(action==='finish'&&wrong&&right){done=true;continue;}
  }else{
   if(action==='alter'&&!modified&&!changed){modified=true;continue;}
   if(action==='changed'&&modified&&!changed){changed=true;continue;}
   if(action==='restore'&&modified&&changed){modified=false;continue;}
   if(action==='right'&&changed&&!modified&&!right){right=true;continue;}
   if(action==='finish'&&changed&&right){done=true;continue;}
  }
  return null;
 }
 return {packet,wrong,right,modified,changed,digests,done};
}
