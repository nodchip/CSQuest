import {createGradientTrial,gradientStep,gradientLoss} from './gradient.js';
export function replayDescentStep(kind,history){
 if(!['small','large','compare'].includes(kind)||!Array.isArray(history))return null;
 const modes=kind==='compare'?['small','large']:[kind];let scene=0,state=createGradientTrial(modes[0]),results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(action==='answer:small'){done=true;continue;}return null;}
  if(action==='reset'){state=createGradientTrial(modes[scene]);continue;}
  if(action==='check'){
   if(state.steps!==2)return null;results.push({mode:modes[scene],w:state.w,loss:gradientLoss(state.w),history:state.history.map(x=>({...x}))});scene++;if(scene===modes.length){if(kind!=='compare')done=true;}else state=createGradientTrial(modes[scene]);continue;
  }
  const m=/^move:(left|right)$/.exec(action);if(!m||state.steps>=2)return null;
  const next=gradientStep(state,m[1]);if(next.steps!==state.steps+1)return null;state=next;
 }
 return {scene,mode:modes[scene]??null,state,results,done};
}
