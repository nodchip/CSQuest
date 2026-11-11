import {svdApply} from './svd-axis.js';
export function replaySvdJourney(kind,history){
 if(!['turn','flat','compare'].includes(kind)||!Array.isArray(history)||history.length>5)return null;
 let seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(turn|flat)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:gram'&&seen.length===2){done=true;continue;}return null;
  }
  const m=/^inspect:(x|y|diagonal)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
  if(action===`answer:${kind==='turn'?'2,1':'1,0'}`&&seen.length===3){done=true;continue;}return null;
 }
 return {seen,done,results:kind==='compare'?{}:Object.fromEntries(seen.map(k=>[k,svdApply(kind,k)]))};
}
export function advanceSvdJourney(kind,history,action){const p=replaySvdJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replaySvdJourney(kind,next)?next:null;}
