export const randomReplayLevel={id:'workshop-random-replay',number:'1049',kind:'random-replay',name:'試験の種と再現の巻物',tag:'疑似乱数と欠陥の再現',title:'壊れた薬瓶を再現する',story:'工房の瓶詰め機が一部の数で止まります。試験の種と失敗の記録を手がかりに、故障を再現して直しましょう。'};
export const randomSeeds=[0,7];
export const randomCases=[7,11,12,15];
export function randomSequence(seed,count){
  if(!randomSeeds.includes(seed)||!Number.isInteger(count)||count<0||count>6)throw new RangeError('試験の記録が不正です。');
  const values=[]; let x=seed;
  for(let i=0;i<count;i++){x=(5*x+1)%16;values.push(x);}
  return values;
}
export function randomFault(n,fixed=false){if(!Number.isInteger(n)||n<0||n>15||typeof fixed!=='boolean')throw new RangeError('瓶の数が不正です。');return !fixed&&n>=12;}
export function randomCreate(){return {seed:0,counts:{0:0,7:0},replay:0,cases:[],fixed:false,retests:[],reflection:null};}
export function randomReady(q){return randomSeeds.every(s=>q.counts[s]===6);}
export function randomCanFix(q){return randomReady(q)&&q.replay===3&&randomCases.every(n=>q.cases.includes(n));}
export function randomDone(q){return q.fixed&&[11,12,15].every(n=>q.retests.includes(n))&&q.reflection==='conditions';}
export function randomRestore(q){
  if(!q||!randomSeeds.includes(q.seed)||!q.counts||randomSeeds.some(s=>!Number.isInteger(q.counts[s])||q.counts[s]<0||q.counts[s]>6)||!Number.isInteger(q.replay)||q.replay<0||q.replay>3||!Array.isArray(q.cases)||new Set(q.cases).size!==q.cases.length||q.cases.some(n=>!randomCases.includes(n))||typeof q.fixed!=='boolean'||!Array.isArray(q.retests)||new Set(q.retests).size!==q.retests.length||q.retests.some(n=>![11,12,15].includes(n))||![null,'conditions','seed-only','none'].includes(q.reflection))throw new RangeError('試験の記録が不正です。');
  if((q.replay>0&&!randomReady(q))||(q.cases.length&&q.replay!==3)||(q.fixed&&!randomCanFix(q))||(!q.fixed&&q.retests.length))throw new RangeError('試験の順序が不正です。');
  return {seed:q.seed,counts:{0:q.counts[0],7:q.counts[7]},replay:q.replay,cases:[...q.cases],fixed:q.fixed,retests:[...q.retests],reflection:q.reflection};
}
