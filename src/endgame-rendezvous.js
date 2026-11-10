import {createBarrier,barrierStep,barrierCaseCorrect} from './barrier.js';
export function replayRendezvous(kind,history){
 if(!['free','barrier','compare'].includes(kind)||!Array.isArray(history)||history.length>100)return null;
 const modes=kind==='compare'?['free','barrier']:[kind],results=[];let scene=0,state=createBarrier(modes[0]),done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(kind!=='compare'||action!=='answer:wait')return null;done=true;continue;}
  if(action==='reset'){state=createBarrier(modes[scene]);continue;}
  if(action==='next'){
   if(!barrierCaseCorrect(modes[scene],state))return null;
   results.push({mode:modes[scene],A:state.workers.A.result,B:state.workers.B.result,waited:state.waited});scene++;
   if(scene<modes.length)state=createBarrier(modes[scene]);else if(kind!=='compare')done=true;
   continue;
  }
  const match=/^step:(A|B)$/.exec(action);if(!match)return null;
  try{const next=barrierStep(state,match[1]);if(next.history.length!==state.history.length+1)return null;state=next;}catch{return null;}
 }
 return {scene,mode:modes[scene]??null,state,results,done};
}
