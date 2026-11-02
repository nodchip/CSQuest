export const flockLevel={id:'ruin-flock-rules',number:'849',kind:'flock-rules',name:'三羽の光鳥と群れの約束',tag:'群れの局所規則',title:'光鳥たちの動きを比べよう',story:'遺跡の空を三羽の光鳥が飛んでいます。近くの仲間を見て動く規則を選び、次の一刻みを予想しましょう。'};
export const flockRules={alignment:{bit:1,name:'速度を合わせる'},cohesion:{bit:2,name:'仲間に近づく'},separation:{bit:4,name:'近すぎる仲間から離れる'}};
export const flockInitial=[{name:'アオ',x:1,v:0},{name:'アカ',x:2,v:1},{name:'キイロ',x:3,v:1}];
export function flockResult(mask){
 if(!Number.isInteger(mask)||mask<0||mask>7)throw new RangeError('規則が不正です。');
 return flockInitial.map((bird,i)=>{
  const near=flockInitial.filter((other,j)=>j!==i&&Math.abs(other.x-bird.x)<=2),close=near.filter(other=>Math.abs(other.x-bird.x)<=1);
  const alignment=near.length?Math.sign(near.reduce((sum,p)=>sum+p.v,0)/near.length-bird.v):0;
  const cohesion=near.length?Math.sign(near.reduce((sum,p)=>sum+p.x,0)/near.length-bird.x):0;
  const separation=Math.sign(close.reduce((sum,p)=>sum+Math.sign(bird.x-p.x),0));
  const adjustment=((mask&1)?alignment:0)+((mask&2)?cohesion:0)+((mask&4)?separation:0),v=Math.max(-2,Math.min(2,bird.v+adjustment));
  return {name:bird.name,alignment,cohesion,separation,v,x:bird.x+v};
 });
}
export function flockCreate(){return {mask:0,trials:Object.fromEntries(Array.from({length:8},(_,i)=>[i,{guess:null,checked:false}])),answer:null};}
export function flockCheck(q){const t=q.trials[q.mask];t.checked=t.guess===flockResult(q.mask)[0].x;return t.checked;}
export function flockComplete(q){return Object.values(q.trials).every(t=>t.checked)&&q.answer==='snapshot';}
export function flockRestore(q){
 if(!q||!Number.isInteger(q.mask)||q.mask<0||q.mask>7||!q.trials||![null,'snapshot','leader','guarantee'].includes(q.answer))throw new RangeError('記録が不正です。');
 const n=flockCreate();n.mask=q.mask;n.answer=q.answer;
 for(let mask=0;mask<8;mask++){const t=q.trials[mask];if(!t||![null,0,1,2,3].includes(t.guess)||typeof t.checked!=='boolean'||t.checked&&t.guess!==flockResult(mask)[0].x)throw new RangeError('記録が不正です。');n.trials[mask]={guess:t.guess,checked:t.checked};}
 return n;
}
