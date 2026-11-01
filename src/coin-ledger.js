export const coinLedgerLevel={id:'castle-coin-ledger',number:'608',kind:'coin-ledger',name:'一枚の銀貨と二通の譲渡',tag:'署名と二重使用',title:'銀貨の受け渡しを確かめよう',story:'ミラの銀貨について、二通の譲渡依頼が届きました。署名と、すでに使われた記録を調べましょう。'};
export const coinActors={mira:'ミラ',rio:'リオ',nono:'ノノ',shadow:'影'};
export const coinTransactions={
 forge:{label:'影がミラの銀貨をノノに渡そうとする',input:'origin',recipient:'nono',signer:'shadow',output:'forged'},
 mr:{label:'ミラがリオに渡す',input:'origin',recipient:'rio',signer:'mira',output:'mr'},
 mn:{label:'ミラがノノに渡す',input:'origin',recipient:'nono',signer:'mira',output:'mn'},
 rn:{label:'リオが受け取った銀貨をノノに渡す',input:'mr',recipient:'nono',signer:'rio',output:'rn'},
};
const sigParams={name:'ECDSA',hash:'SHA-256'},encoder=new TextEncoder();
export const coinBody=tx=>encoder.encode(JSON.stringify([tx.input,tx.recipient,tx.output]));
export async function runCoinLedger(subtle,history){
 if(!subtle||!Array.isArray(history)||history.length>12||history.some(id=>!Object.hasOwn(coinTransactions,id)))throw new RangeError('取引履歴が不正です');
 const keyParams={name:'ECDSA',namedCurve:'P-256'};
 const [mira,rio,shadow]=await Promise.all(Array.from({length:3},()=>subtle.generateKey(keyParams,false,['sign','verify']))),keys={mira,rio,shadow};
 const unspent=new Map([['origin','mira']]),spent=new Set(),results=[];
 for(const id of history){
  const tx=coinTransactions[id],owner=unspent.get(tx.input);
  if(!owner){results.push({id,status:spent.has(tx.input)?'spent':'missing',verified:null});continue;}
  const signature=await subtle.sign(sigParams,keys[tx.signer].privateKey,coinBody(tx));
  const verified=await subtle.verify(sigParams,keys[owner].publicKey,signature,coinBody(tx));
  if(!verified){results.push({id,status:'signature',verified:false});continue;}
  unspent.delete(tx.input);spent.add(tx.input);unspent.set(tx.output,tx.recipient);results.push({id,status:'accepted',verified:true});
 }
 return {results,unspent:[...unspent].map(([id,owner])=>({id,owner}))};
}
export function createCoinLedger(){return {history:[],selected:'forge',guess:null,observed:[],answer:null,checked:false};}
export function coinLedgerComplete(s){return ['forge','mr','mn','rn','spent'].every(x=>s.observed.includes(x))&&s.answer==='both'&&s.checked;}
export function restoreCoinLedger(s){
 if(!s||!Array.isArray(s.history)||s.history.length>12||s.history.some(id=>!Object.hasOwn(coinTransactions,id))||!Object.hasOwn(coinTransactions,s.selected)||![null,'accepted','spent','missing','signature'].includes(s.guess)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!['forge','mr','mn','rn','spent'].includes(k))||![null,'both','signature','order'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,history:[...s.history],observed:[...s.observed]};
}
