import {createReplica,replicaStep} from './replica-lag.js';

const kinds=['stale','delivery','compare'];
const operations=['write','readPrimary','readReplica','deliver','heal'];
function ready(kind,s){
 if(kind==='stale')return s.flags.wrote&&s.flags.primaryRead&&s.flags.stale;
 return s.flags.wrote&&s.flags.stale&&s.flags.failedDelivery&&s.flags.delivered&&s.flags.fresh;
}
export function replayReplicaJourney(kind,history){
 if(!kinds.includes(kind)||!Array.isArray(history)||history.length>24)return null;
 let s=createReplica(),done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(operations.includes(action)){const n=replicaStep(s,action);if(n.history.length!==s.history.length+1)return null;s=n;continue;}
  if(action===(kind==='compare'?'answer:delayed':'check')&&ready(kind,s)){done=true;continue;}
  return null;
 }
 return {model:s,done,ready:ready(kind,s)};
}
export function advanceReplicaJourney(kind,history,action){
 const p=replayReplicaJourney(kind,history);if(!p||p.done)return null;
 const next=action==='reset'?[]:[...history,action];return replayReplicaJourney(kind,next)?next:null;
}
