import {lambdaCases} from './lambda-reduction.js';
export function replayLambdaJourney(kind,history){
 if(!['simple','capture','compare'].includes(kind)||!Array.isArray(history)||history.length>4)return null;
 let index=0,seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(simple|capture)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:fresh'&&seen.length===2){done=true;continue;}return null;
  }
  if(action===`choose:${lambdaCases[kind].steps[index].answer}`){index++;if(index===lambdaCases[kind].steps.length)done=true;continue;}return null;
 }
 return {index,seen,done,step:kind==='compare'||done?null:lambdaCases[kind].steps[index],result:kind==='compare'?null:lambdaCases[kind].result};
}
export function advanceLambdaJourney(kind,history,action){const p=replayLambdaJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayLambdaJourney(kind,next)?next:null;}
