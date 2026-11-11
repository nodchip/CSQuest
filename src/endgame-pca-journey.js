import {pcaResult,pcaCases} from './pca-axis.js';
export function replayPcaJourney(kind,history){
 if(!['diagonal','horizontal','compare'].includes(kind)||!Array.isArray(history)||history.length>6)return null;
 let seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(diagonal|horizontal)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:eigen'&&seen.length===2){done=true;continue;}return null;
  }
  const m=/^inspect:(x|y|diagonal|anti)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
  if(action===`answer:${pcaCases[kind].best}`&&seen.length===4){done=true;continue;}return null;
 }
 return {seen,done,results:kind==='compare'?{}:Object.fromEntries(seen.map(k=>[k,pcaResult(kind,k)]))};
}
export function advancePcaJourney(kind,history,action){const p=replayPcaJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayPcaJourney(kind,next)?next:null;}
