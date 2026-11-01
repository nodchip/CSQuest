export const cryptoCargoLevel={id:'castle-crypto-cargo',number:'612',kind:'crypto-cargo',name:'伝令の荷物と二種類の鍵',tag:'暗号の大きさと処理時間',title:'伝令に合う暗号の荷造りを比べよう',story:'王城から異なる長さの伝令を送ります。共通鍵と公開鍵を使った荷造りを試し、荷物の大きさと処理時間を調べましょう。'};
export const cryptoCargoSizes=[16,64,1024];
const equal=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
export async function runCryptoCargo(subtle,clock,size){
 if(!subtle||!clock||typeof clock.now!=='function'||!cryptoCargoSizes.includes(size))throw new RangeError('実験の条件が不正です');
 const aes=await subtle.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']);
 const rsa=await subtle.generateKey({name:'RSA-OAEP',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},false,['encrypt','decrypt','wrapKey','unwrapKey']);
 const data=Uint8Array.from({length:size},(_,i)=>i%256),aesTimes=[],rsaTimes=[];let counter=0,lastIv,lastCipher;
 const encryptAes=async()=>{const iv=new Uint8Array(12);new DataView(iv.buffer).setUint32(8,++counter);const start=clock.now(),cipher=await subtle.encrypt({name:'AES-GCM',iv,tagLength:128},aes,data),elapsed=clock.now()-start;lastIv=iv;lastCipher=cipher;return elapsed;};
 await encryptAes();for(let i=0;i<9;i++)aesTimes.push(await encryptAes());
 const aesPlain=new Uint8Array(await subtle.decrypt({name:'AES-GCM',iv:lastIv,tagLength:128},aes,lastCipher));
 let direct=null,oversizeRejected=false;
 if(size<=190){
  await subtle.encrypt({name:'RSA-OAEP'},rsa.publicKey,data);
  for(let i=0;i<9;i++){const start=clock.now();direct=await subtle.encrypt({name:'RSA-OAEP'},rsa.publicKey,data);rsaTimes.push(clock.now()-start);}
  const plain=new Uint8Array(await subtle.decrypt({name:'RSA-OAEP'},rsa.privateKey,direct));if(!equal(plain,data))throw new Error('RSA 復号に失敗しました');
 }else{
  try{await subtle.encrypt({name:'RSA-OAEP'},rsa.publicKey,data);}catch(e){if(e.name!=='OperationError')throw e;oversizeRejected=true;}
  if(!oversizeRejected)throw new Error('RSA の長さ制限を確認できませんでした');
 }
 const wrapped=await subtle.wrapKey('raw',aes,rsa.publicKey,{name:'RSA-OAEP'});
 const unwrapped=await subtle.unwrapKey('raw',wrapped,rsa.privateKey,{name:'RSA-OAEP'},{name:'AES-GCM',length:256},false,['decrypt']);
 const unwrappedPlain=new Uint8Array(await subtle.decrypt({name:'AES-GCM',iv:lastIv,tagLength:128},unwrapped,lastCipher));
 if(!equal(aesPlain,data)||!equal(unwrappedPlain,data))throw new Error('AES の復号に失敗しました');
 return {size,aesBytes:lastCipher.byteLength,ivBytes:lastIv.length,rsaBytes:direct?.byteLength??null,rsaLimit:190,oversizeRejected,wrappedBytes:wrapped.byteLength,hybridBytes:lastCipher.byteLength+lastIv.length+wrapped.byteLength,aesMedian:median(aesTimes),rsaMedian:rsaTimes.length?median(rsaTimes):null,samples:9,roundTrip:true};
}
export function createCryptoCargo(){return {size:16,rsaGuess:null,aesGuess:null,tested:[],answer:null,checked:false};}
export function cryptoCargoComplete(s){return cryptoCargoSizes.every(n=>s.tested.includes(n))&&s.answer==='measurement'&&s.checked;}
export function restoreCryptoCargo(s){
 if(!s||!cryptoCargoSizes.includes(s.size)||![null,true,false].includes(s.rsaGuess)||![null,32,80,1040].includes(s.aesGuess)||!Array.isArray(s.tested)||new Set(s.tested).size!==s.tested.length||s.tested.some(x=>!cryptoCargoSizes.includes(x))||![null,'measurement','always','auth'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,tested:[...s.tested]};
}
