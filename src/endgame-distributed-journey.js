import {createDistributedTrial,distributedStep} from './distributed-join.js';
export function replayDistributedJourney(kind,history){
 if(!['all','semi','compare'].includes(kind)||!Array.isArray(history)||history.length>8)return null;
 let trial=kind==='compare'?null:createDistributedTrial('sparse',kind),seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(all|semi)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:semi'&&seen.length===2){done=true;continue;}return null;
  }
  if(!['guess2','guess3','guess6','keys','filter','ship','join'].includes(action))return null;
  const next=distributedStep(trial,action);if(next.history.length!==trial.history.length+1)return null;trial=next;done=trial.phase==='done';
 }
 return {trial,seen,done};
}
export function advanceDistributedJourney(kind,history,action){const p=replayDistributedJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayDistributedJourney(kind,next)?next:null;}
