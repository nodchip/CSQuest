import {createStarvationTrial,starvationStep} from './starvation.js';
export function replayAgingWork(kind,history){
 if(!['fixed','aging','compare'].includes(kind)||!Array.isArray(history)||history.length>50)return null;
 const modes=kind==='compare'?['fixed','aging']:[kind],results=[];let scene=0,state=createStarvationTrial(modes[0]),done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(kind!=='compare'||action!=='answer:backlog')return null;done=true;continue;}
  if(action==='reset'){state=createStarvationTrial(modes[scene]);continue;}
  if(action==='next'){
   if(state.time!==5)return null;results.push({mode:modes[scene],lowDone:state.lowDone,backlog:state.backlog,order:[...state.history]});scene++;if(scene<modes.length)state=createStarvationTrial(modes[scene]);else if(kind!=='compare')done=true;continue;
  }
  if(!['low','high'].includes(action))return null;
  let n;try{n=starvationStep(state,action);}catch{return null;}if(n.history.length!==state.history.length+1)return null;state=n;
 }
 return {scene,mode:modes[scene]??null,state,results,done};
}
