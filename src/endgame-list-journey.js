import {listState} from './persistent-list.js';
export function replayListJourney(kind,history){
 if(!['mutable','persistent','compare'].includes(kind)||!Array.isArray(history)||history.length>8)return null;
 let stage=0,seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(mutable|persistent)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:share'&&seen.length===2){done=true;continue;}return null;
  }
  if(action==='front'&&stage===0){stage=1;continue;}
  if(action==='change'&&stage===1){stage=2;continue;}
  if(stage===2&&action===`answer:${kind==='mutable'?'changed':'preserved'}`){done=true;continue;}
  return null;
 }
 return {stage,seen,done,model:kind==='compare'?null:listState(kind,stage)};
}
export function advanceListJourney(kind,history,action){const p=replayListJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayListJourney(kind,next)?next:null;}
