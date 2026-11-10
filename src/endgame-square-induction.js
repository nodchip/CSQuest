import {inductionSteps} from './induction.js';
export function replaySquareInduction(kind,history){
 if(!['one','two','proof'].includes(kind)||!Array.isArray(history)||history.length>30)return null;
 const n=kind==='one'?1:2;let right=0,bottom=0,step=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind==='proof'){
   const expected=inductionSteps[step]?.answer;if(action!==`answer:${expected}`)return null;step++;done=step===inductionSteps.length;continue;
  }
  if(action==='right'&&right<n)right++;
  else if(action==='bottom'&&bottom<n+1)bottom++;
  else if(action==='reset'){right=0;bottom=0;}
  else if(action==='check'&&right===n&&bottom===n+1)done=true;
  else return null;
 }
 return {n,right,bottom,step,done};
}
