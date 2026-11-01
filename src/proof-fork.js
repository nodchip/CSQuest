export const proofForkLevel={id:'castle-proof-fork',number:'607',kind:'proof-fork',name:'分かれた台帳と計算の証',tag:'作業証明と分岐',title:'二つの台帳を比べよう',story:'同じ台帳から二つの記録が生まれました。印を探して枝を伸ばし、王城がどちらを採用するか調べましょう。'};
const genesis='0'.repeat(64),encoder=new TextEncoder();
export const forkRecords={a:['北に薬草２箱','北に水１桶','北に麦１袋'],b:['北に薬草９箱','北に水１桶','北に麦１袋']};
export async function forkDigest(subtle,index,record,previous,nonce){
 const bytes=new Uint8Array(await subtle.digest('SHA-256',encoder.encode(JSON.stringify([index,record,previous,nonce]))));
 return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
}
export async function forkBranch(subtle,branch,nonces,corrupt=false){
 if(!subtle||!Object.hasOwn(forkRecords,branch)||!Array.isArray(nonces)||nonces.length>3||nonces.some(n=>!Number.isInteger(n)||n<0||n>=2048)||typeof corrupt!=='boolean')throw new RangeError('台帳が不正です');
 let prev=genesis;const blocks=[];
 for(let i=0;i<nonces.length;i++){
  const original=forkRecords[branch][i],nonce=nonces[i],hash=await forkDigest(subtle,i+1,original,prev,nonce),record=corrupt&&i===0?original+'（書換え）':original;
  const actual=record===original?hash:await forkDigest(subtle,i+1,record,prev,nonce);
  blocks.push({number:i+1,record,previous:prev,nonce,hash,valid:hash.startsWith('0')&&actual===hash});prev=hash;
 }
 return {blocks,valid:blocks.every(b=>b.valid)};
}
export async function mineForkBlock(subtle,branch,nonces){
 const current=await forkBranch(subtle,branch,nonces);
 if(!current.valid||nonces.length>=3)throw new RangeError('この枝は伸ばせません');
 const prev=current.blocks.at(-1)?.hash??genesis,index=nonces.length+1,record=forkRecords[branch][index-1];
 for(let nonce=0;nonce<2048;nonce++){const hash=await forkDigest(subtle,index,record,prev,nonce);if(hash.startsWith('0'))return {nonce,hash,attempts:nonce+1};}
 throw new RangeError('候補の範囲に印がありません');
}
export async function compareForks(subtle,state){
 const [a,b]=await Promise.all([forkBranch(subtle,'a',state.a),forkBranch(subtle,'b',state.b,state.corrupt)]);
 let choice;if(!a.valid&&!b.valid)choice='none';else if(!a.valid)choice='b';else if(!b.valid)choice='a';else choice=state.a.length===state.b.length?'tie':state.a.length>state.b.length?'a':'b';
 return {a,b,choice};
}
export function consensusShares(method,allocation){if(!['work','stake'].includes(method)||!['north','south'].includes(allocation))throw new RangeError('条件が不正です');return allocation==='north'?{north:3,south:1,total:4}:{north:1,south:3,total:4};}
export function createConsensusComparison(){return {seen:[],answer:null,checked:false};}
export function consensusComparisonCorrect(c){return c.checked&&c.seen.length===4&&c.answer==='tradeoff';}
export function createProofFork(){return {a:[],b:[],corrupt:false,observed:[],answer:null,checked:false,comparison:createConsensusComparison()};}
export function proofForkComplete(s){return ['tie','longer','invalid'].every(x=>s.observed.includes(x))&&s.answer==='work'&&s.checked&&consensusComparisonCorrect(s.comparison);}
export function restoreProofFork(s){
 const validBranch=a=>Array.isArray(a)&&a.length<=3&&a.every(n=>Number.isInteger(n)&&n>=0&&n<2048);
 if(!s||!validBranch(s.a)||!validBranch(s.b)||typeof s.corrupt!=='boolean'||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(x=>!['tie','longer','invalid'].includes(x))||![null,'work','count','truth'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 const comparison=createConsensusComparison();if(s.comparison!==undefined){const c=s.comparison;if(!c||!Array.isArray(c.seen)||new Set(c.seen).size!==c.seen.length||c.seen.some(x=>!['work-north','work-south','stake-north','stake-south'].includes(x))||![null,'tradeoff','free','identical'].includes(c.answer)||typeof c.checked!=='boolean')throw new RangeError('保存データが不正です');comparison.seen=c.seen.slice();comparison.answer=c.answer;comparison.checked=c.checked;}
 return {...s,a:[...s.a],b:[...s.b],observed:[...s.observed],comparison};
}
