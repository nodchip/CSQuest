export const limitLawsLevel={id:'crystal-limit-laws',number:'652',kind:'limit-laws',name:'たくさんの札と鐘の曲線',tag:'大数の法則と中心極限定理',title:'札の平均が集まる様子を調べよう',story:'宝石工房の精霊は、公平な札を何度も投げたときの表の割合を調べています。回数を変えて試し、平均の分布を比べましょう。'};
export const limitSizes=[4,16,64];
export const limitBucketLabels=['0〜0.25未満','0.25以上〜0.375未満','0.375以上〜0.625以下','0.625超〜0.75以下','0.75超〜1'];
export function limitDistribution(n){
 if(!limitSizes.includes(n))throw new RangeError('札の回数が不正です。');
 const counts=[1n];for(let k=0;k<n;k++)counts.push(counts[k]*BigInt(n-k)/BigInt(k+1));
 const total=1n<<BigInt(n),bins=[0n,0n,0n,0n,0n];let near=0n,standard=0n;
 for(let k=0;k<=n;k++){
  const c=counts[k],bin=4*k<n?0:8*k<3*n?1:8*k<=5*n?2:4*k<=3*n?3:4;bins[bin]+=c;
  if(2*Math.abs(2*k-n)<=n)near+=c;
  if(Math.abs(2*k-n)<Math.sqrt(n))standard+=c;
 }
 return {counts,total,bins,near,standard};
}
export function limitDraw(n,bytes){if(!limitSizes.includes(n)||!(bytes instanceof Uint8Array)||bytes.length!==n)throw new RangeError('抽選が不正です。');return bytes.reduce((sum,v)=>sum+(v&1),0);}
export function createLimitLaws(){return {n:4,samples:{4:[],16:[],64:[]},lln:null,clt:null,finite:null,checked:false};}
export function limitLawsComplete(s){return limitSizes.every(n=>s.samples[n].length>0)&&s.lln==='near'&&s.clt==='standard'&&s.finite==='not-guaranteed'&&s.checked;}
export function restoreLimitLaws(s){
 if(!s||!limitSizes.includes(s.n)||!s.samples||![null,'near','exact','spread'].includes(s.lln)||![null,'standard','raw','all'].includes(s.clt)||![null,'not-guaranteed','always','never'].includes(s.finite)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const samples={};for(const n of limitSizes){const a=s.samples[n];if(!Array.isArray(a)||a.length>10||a.some(k=>!Number.isInteger(k)||k<0||k>n))throw new RangeError('実験記録が不正です。');samples[n]=[...a];}return {...s,samples};
}
