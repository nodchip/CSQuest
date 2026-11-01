export const hashChainLevel={id:'castle-hash-chain',number:'606',kind:'hash-chain',name:'書き換えられた連なる台帳',tag:'ハッシュ連鎖と信頼',title:'台帳の足跡を確かめよう',story:'王城に届いた三枚の台帳。影が書き換えた記録と、前の台帳につながる印を調べます。'};
export const hashChainRecords=[['北の村へ薬草２箱','北の村へ薬草９箱'],['東の村へ水３桶','東の村へ水８桶'],['西の村へ麦４袋','西の村へ麦７袋']];
const genesis='0'.repeat(64);
const encode=new TextEncoder();
export async function chainDigest(subtle,number,record,previous){
 const data=encode.encode(JSON.stringify([number,record,previous]));
 const bytes=new Uint8Array(await subtle.digest('SHA-256',data));
 return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
}
export async function evaluateHashChain(subtle,edited,repairs){
 if(!subtle||![null,0,1,2].includes(edited)||!Array.isArray(repairs)||repairs.length>30||repairs.some(i=>![0,1,2].includes(i)))throw new RangeError('台帳の条件が不正です');
 const blocks=[];
 for(let i=0;i<3;i++){const previous=i===0?genesis:blocks[i-1].hash,record=hashChainRecords[i][0];blocks.push({number:i+1,record,previous,hash:await chainDigest(subtle,i+1,record,previous)});}
 const anchor=blocks[2].hash;
 if(edited!==null)blocks[edited].record=hashChainRecords[edited][1];
 for(const i of repairs){const b=blocks[i];b.previous=i===0?genesis:blocks[i-1].hash;b.hash=await chainDigest(subtle,b.number,b.record,b.previous);}
 const checked=await Promise.all(blocks.map(async(b,i)=>({...b,validHash:b.hash===await chainDigest(subtle,b.number,b.record,b.previous),validLink:b.previous===(i===0?genesis:blocks[i-1].hash)})));
 return {blocks:checked,anchor,anchorMatches:blocks[2].hash===anchor,valid:checked.every(b=>b.validHash&&b.validLink)};
}
export function createHashChain(){return {edited:null,repairs:[],observed:[],answer:null,checked:false};}
export function hashChainComplete(s){return ['original','broken','forged'].every(x=>s.observed.includes(x))&&s.answer==='anchor'&&s.checked;}
export function restoreHashChain(s){
 if(!s||![null,0,1,2].includes(s.edited)||!Array.isArray(s.repairs)||s.repairs.length>30||s.repairs.some(i=>![0,1,2].includes(i))||(s.edited===null&&s.repairs.length)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(x=>!['original','broken','forged'].includes(x))||![null,'anchor','hash','unchanged'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,repairs:[...s.repairs],observed:[...s.observed]};
}
