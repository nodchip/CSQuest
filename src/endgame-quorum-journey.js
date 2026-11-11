import {createQuorumTrial,quorumStep} from './quorum.js';
export function replayQuorumJourney(kind,history){
 if(!['overlap','single','compare'].includes(kind)||!Array.isArray(history)||history.length>8)return null;
 let trial=kind==='compare'?null:createQuorumTrial(kind),seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(overlap|single)$/.exec(action);
   if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:overlap'&&seen.length===2){done=true;continue;}
   return null;
  }
  const write=/^write:(A|B|C|AB|AC|BC)$/.exec(action),read=/^read:(A|B|C|AB|AC|BC):(3|4)$/.exec(action);
  const op=write?['write',[...write[1]]]:read?['read',[...read[1]],Number(read[2])]:null;
  if(!op)return null;const next=quorumStep(trial,op);if(next.history.length!==trial.history.length+1)return null;trial=next;done=trial.phase==='done';
 }
 return {trial,seen,done};
}
export function advanceQuorumJourney(kind,history,action){const p=replayQuorumJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayQuorumJourney(kind,next)?next:null;}
