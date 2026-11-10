import {createWritePolicyTrial,writePolicyStep} from './write-policy.js';
export function replayWritePolicy(kind,history){
 if(!['through','back','compare'].includes(kind)||!Array.isArray(history)||history.length>60)return null;
 const modes=kind==='compare'?['through','back']:[kind],results=[];let scene=0,state=createWritePolicyTrial(modes[0]),done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(kind!=='compare'||action!=='answer:coalesce')return null;done=true;continue;}
  if(action==='reset'){state=createWritePolicyTrial(modes[scene]);continue;}
  if(action==='next'){
   if(state.history.length!==7)return null;results.push({mode:modes[scene],before:Number(state.history[3].slice(7)),after:Number(state.history[5].slice(6)),writes:state.writes});scene++;
   if(scene<modes.length)state=createWritePolicyTrial(modes[scene]);else if(kind!=='compare')done=true;continue;
  }
  let next;try{next=writePolicyStep(state,action);}catch{return null;}if(next.history.length!==state.history.length+1)return null;state=next;
 }
 return {scene,mode:modes[scene]??null,state,results,done};
}
