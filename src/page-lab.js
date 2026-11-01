export const pageLabLevel={id:'archive-page-lab',number:'487',kind:'page-lab',name:'頁の巡りと棚の逆説',tag:'頁置換と枠数の比較',title:'頁の巡りを組み立てよう',story:'書庫の棚を増やしたのに頁の取寄せが増えたという報告です。頁の巡りを変え、三つの方法と棚の数を比べましょう。'};
export const pageNames=['A','B','C','D','E'];
export const anomalySequence=['A','B','C','D','A','B','E','A','B','C','D','E'];
export const localitySequence=['A','B','C','A','B','C','A','B','C'];
export function simulatePages(sequence,capacity,policy){
 if(!Array.isArray(sequence)||sequence.length<1||sequence.length>12||sequence.some(p=>!pageNames.includes(p))||![3,4].includes(capacity)||!['fifo','lru','optimal'].includes(policy))throw new RangeError('参照列・枠数・方式を確認してください。');
 const frames=[],loaded=new Map(),used=new Map();let faults=0;
 const steps=sequence.map((page,i)=>{
  let victim=null,hit=frames.includes(page);
  if(!hit){faults++;if(frames.length===capacity){
   let chosen=0,best=-Infinity;
   for(let j=0;j<frames.length;j++){
    const p=frames[j];let priority;
    if(policy==='fifo')priority=-loaded.get(p);
    else if(policy==='lru')priority=-used.get(p);
    else {const next=sequence.indexOf(p,i+1);priority=next<0?Infinity:next;}
    if(priority>best){best=priority;chosen=j;}
   }
   victim=frames[chosen];frames[chosen]=page;loaded.delete(victim);used.delete(victim);
  }else frames.push(page);loaded.set(page,i);
  }
  used.set(page,i);return {page,hit,victim,frames:[...frames],faults};
 });return {steps,faults};
}
export function createPageLab(){return {sequence:[],shown:false,anomalySeen:false,otherSeen:false,answer:null,checked:false};}
export function runPageLab(s){
 if(!s.sequence.length)throw new RangeError('頁を１枚以上選びましょう。');
 const three=simulatePages(s.sequence,3,'fifo'),four=simulatePages(s.sequence,4,'fifo');
 return {...s,shown:true,anomalySeen:s.anomalySeen||four.faults>three.faults,otherSeen:s.otherSeen||four.faults<=three.faults,checked:false};
}
export function pageLabComplete(s){return s.anomalySeen&&s.otherSeen&&s.answer==='depends'&&s.checked;}
export function restorePageLab(s){
 if(!s||!Array.isArray(s.sequence)||s.sequence.length>12||s.sequence.some(p=>!pageNames.includes(p))||typeof s.shown!=='boolean'||s.shown&&!s.sequence.length||typeof s.anomalySeen!=='boolean'||typeof s.otherSeen!=='boolean'||![null,'depends','always','future'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {sequence:[...s.sequence],shown:s.shown,anomalySeen:s.anomalySeen,otherSeen:s.otherSeen,answer:s.answer,checked:s.checked};
}
