import {newSharingTrial,sharingStep} from './evaluation-sharing.js';
export function replaySharingJourney(kind,history){
 if(!['value','name','need'].includes(kind)||!Array.isArray(history)||history.length>4)return null;
 let trial=newSharingTrial();
 for(const action of history){
  if(!['start','use','return'].includes(action)||trial.finished)return null;
  const next=sharingStep(`${kind}-twice`,trial,action);if(next.history.length!==trial.history.length+1)return null;trial=next;
 }
 return {trial,done:trial.finished};
}
export function advanceSharingJourney(kind,history,action){const p=replaySharingJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replaySharingJourney(kind,next)?next:null;}
