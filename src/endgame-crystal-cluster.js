import {clusterPoints,createClusterTrial,clusterAdvance} from './clustering.js';
export function replayCrystalCluster(kind,history){
 if(!['far','near','compare'].includes(kind)||!Array.isArray(history))return null;
 const modes=kind==='compare'?['far','near']:[kind];let scene=0,state=createClusterTrial(modes[0]),results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(action==='answer:unlabeled'){done=true;continue;}return null;}
  if(action==='reset'){state=createClusterTrial(modes[scene]);continue;}
  if(action==='next'){
   if(!state.done)return null;results.push({mode:modes[scene],centers:[...state.centers],rounds:state.history.length});scene++;if(scene===modes.length){if(kind!=='compare')done=true;}else state=createClusterTrial(modes[scene]);continue;
  }
  if(state.done)return null;
  if(action==='check'){let next;try{next=clusterAdvance(state);}catch{return null;}if(!next)return null;state=next;continue;}
  const m=/^set:([0-3]):([ab])$/.exec(action);if(!m)return null;
  state={...state,assignments:state.assignments.map((v,i)=>i===Number(m[1])?m[2]:v)};
 }
 return {scene,mode:modes[scene]??null,state,results,done};
}
export {clusterPoints};
