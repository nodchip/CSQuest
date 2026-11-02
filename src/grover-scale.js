export const scaleLevel={id:'ruin-grover-scale',number:'861',kind:'grover-scale',name:'扉の数と量子探索の回数',tag:'量子探索の設計',title:'扉の数に合う探索を選ぼう',story:'遺跡には４・８・16枚の扉の部屋があります。１つだけある印を、依頼820で学んだ反転を使って探す計画を立てましょう。'};
export const scaleSizes=[4,8,16];
export const scaleBest={4:'1',8:'2',16:'3'};
export function scaleReplay(size,history){
 if(!scaleSizes.includes(size)||!Array.isArray(history)||history.length>8)throw new RangeError('記録が不正です。');
 let a=Array(size).fill(1/Math.sqrt(size)),rounds=[a[0]**2];
 for(let i=0;i<history.length;i++){
  const expected=i%2===0?'oracle':'diffuse';if(history[i]!==expected)throw new RangeError('次の操作を確かめましょう。');
  if(expected==='oracle')a[0]*=-1;else {const mean=a.reduce((sum,x)=>sum+x,0)/size;a=a.map(x=>2*mean-x);rounds.push(a[0]**2);}
 }
 return {amplitudes:a,probability:a[0]**2,rounds,queries:Math.ceil(history.length/2),iterations:Math.floor(history.length/2),next:history.length===8?null:history.length%2?'diffuse':'oracle'};
}
export function scaleCreate(){return {size:4,histories:{4:[],8:[],16:[]},answers:{4:null,8:null,16:null},reflection:null};}
export function scaleStep(q,action){const h=q.histories[q.size];scaleReplay(q.size,[...h,action]);h.push(action);}
export function scaleComplete(q){return scaleSizes.every(size=>q.histories[size].length===8&&scaleReplay(size,q.histories[size]).next===null&&q.answers[size]===scaleBest[size])&&q.reflection==='limits';}
export function scaleRestore(q){
 if(!q||!scaleSizes.includes(q.size)||!q.histories||!q.answers||![null,'limits','certain','free'].includes(q.reflection))throw new RangeError('記録が不正です。');
 const copy=scaleCreate();copy.size=q.size;copy.reflection=q.reflection;
 for(const size of scaleSizes){scaleReplay(size,q.histories[size]);const answer=q.answers[size];if(![null,'0','1','2','3','4'].includes(answer))throw new RangeError('回答が不正です。');copy.histories[size]=[...q.histories[size]];copy.answers[size]=answer;}
 return copy;
}
