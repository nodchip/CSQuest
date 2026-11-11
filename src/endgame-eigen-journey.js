import {eigenApply,eigenAnswer,eigenVectors} from './eigen-directions.js';
export function replayEigenJourney(kind,history){
 if(!['stretch','flatten','rotate'].includes(kind)||!Array.isArray(history)||history.length>10)return null;
 let seen=[],answered=[],current=null,done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  const m=/^inspect:(x|y|diagonal|zero)$/.exec(action);
  if(kind==='rotate'){
   if(m&&m[1]!=='zero'&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:none'&&seen.length===3){done=true;continue;}return null;
  }
  if(m&&!current&&!answered.includes(m[1])){current=m[1];seen.push(current);continue;}
  if(current&&action===`answer:${eigenAnswer(kind,eigenVectors[current].value)}`){answered.push(current);current=null;if(answered.length===4)done=true;continue;}
  return null;
 }
 const mode=kind==='rotate'?'turn':kind;
 return {seen,answered,current,done,outputs:Object.fromEntries(seen.map(k=>[k,eigenApply(mode,eigenVectors[k].value)]))};
}
export function advanceEigenJourney(kind,history,action){const p=replayEigenJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayEigenJourney(kind,next)?next:null;}
