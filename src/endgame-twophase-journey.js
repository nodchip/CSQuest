import {createTwoPhaseTrial,twoPhaseStep,twoPhaseTrialComplete,twoPhaseActions} from './two-phase-commit.js';
export function replayTwoPhaseJourney(kind,history){
 if(!['crash','reject','compare'].includes(kind)||!Array.isArray(history)||history.length>14)return null;
 let trial=kind==='compare'?null:createTwoPhaseTrial(kind),seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(crash|reject)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:wait'&&seen.length===2){done=true;continue;}return null;
  }
  if(!Object.hasOwn(twoPhaseActions,action))return null;
  const next=twoPhaseStep(trial,action);if(next.history.length!==trial.history.length+1)return null;trial=next;done=twoPhaseTrialComplete(trial);
 }
 return {trial,seen,done};
}
export function advanceTwoPhaseJourney(kind,history,action){const p=replayTwoPhaseJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayTwoPhaseJourney(kind,next)?next:null;}
