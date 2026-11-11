import {createCoins,chooseCoin} from './coins.js';
const denominations=[1,3,4];
export function replayCoinPlan(kind,history){
 if(!['greedy','table','compare'].includes(kind)||!Array.isArray(history)||history.length>40)return null;
 let remain=6,taken=[],dp=createCoins(),done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){remain=6;taken=[];dp=createCoins();continue;}
  const take=/^take:(1|3|4)$/.exec(action);if(take){const n=Number(take[1]),max=denominations.filter(x=>x<=remain).at(-1);if(kind==='table'||!remain||n!==max)return null;taken.push(n);remain-=n;continue;}
  const coin=/^table:(1|3|4)$/.exec(action);if(coin){if(kind==='greedy'||dp.counts.length>6)return null;let next;try{next=chooseCoin(dp,Number(coin[1]));}catch{return null;}if(next.choices.length!==dp.choices.length+1)return null;dp=next;continue;}
  if(kind==='greedy'&&remain===0&&action==='answer:3'||kind==='table'&&dp.counts.length===7&&action==='answer:2'||kind==='compare'&&remain===0&&dp.counts.length===7&&action==='answer:table'){done=true;continue;}
  return null;
 }
 return {remain,taken,dp,done};
}
export function advanceCoinPlan(kind,history,action){const p=replayCoinPlan(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayCoinPlan(kind,next)?next:null;}
