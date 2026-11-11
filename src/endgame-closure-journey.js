import {closureCases,makeSeal} from './closures.js';
export function replayClosureJourney(kind,history){
 if(!['first','second','compare'].includes(kind)||!Array.isArray(history)||history.length>6)return null;
 let old=null,recent=null,oldAnswer=false,recentAnswer=false,seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(first|second)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:bindings'&&seen.length===2){done=true;continue;}return null;
  }
  const c=closureCases[kind];
  if(old===null&&action===`create:old:${c.oldFactor}`){old=c.oldFactor;continue;}
  if(old!==null&&recent===null&&action===`create:recent:${c.newFactor}`){recent=c.newFactor;continue;}
  if(recent!==null&&!oldAnswer&&action===`answer:old:${makeSeal(old)(c.input)}`){oldAnswer=true;continue;}
  if(oldAnswer&&!recentAnswer&&action===`answer:recent:${makeSeal(recent)(c.input)}`){recentAnswer=true;done=true;continue;}
  return null;
 }
 return {old,recent,oldAnswer,recentAnswer,seen,done};
}
export function advanceClosureJourney(kind,history,action){const p=replayClosureJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayClosureJourney(kind,next)?next:null;}
