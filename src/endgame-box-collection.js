import {gcCases,gcCheck,gcReachable} from './garbage-collection.js';
import {createRefTrial,refStep} from './reference-counting.js';
export function replayBoxCollection(kind,history){
 if(!['chain','cycle','compare'].includes(kind)||!Array.isArray(history)||history.length>40)return null;
 let selected=[],swept=[],phase=kind==='compare'?'ref':'mark',ref=createRefTrial('cycle'),done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){selected=[];swept=[];phase=kind==='compare'?'ref':'mark';ref=createRefTrial('cycle');continue;}
  if(kind==='compare'&&phase==='ref'){
   const mapped=action==='collect:A'?'A':action==='finish-ref'?'finish':action;
   if(!['release','A','finish'].includes(mapped))return null;
   let next;try{next=refStep(ref,mapped);}catch{return null;}if(next.history.length!==ref.history.length+1)return null;ref=next;if(ref.done)phase='trace';continue;
  }
  if(kind==='compare'&&phase==='trace'&&action==='trace'){phase='sweep';continue;}
  const m=/^toggle:([A-E])$/.exec(action);
  if(kind!=='compare'&&phase==='mark'&&m){const n=m[1];if(!Object.hasOwn(gcCases[kind].edges,n))return null;selected=selected.includes(n)?selected.filter(x=>x!==n):[...selected,n].sort();continue;}
  if(kind!=='compare'&&phase==='mark'&&action==='check'&&gcCheck(kind,selected)){phase='sweep';continue;}
  const x=/^sweep:([A-E])$/.exec(action);
  if(phase==='sweep'&&x){const n=x[1],allowed=kind==='compare'?['B','C']:Object.keys(gcCases[kind].edges).filter(v=>!gcReachable(kind).includes(v));if(!allowed.includes(n)||swept.includes(n))return null;swept.push(n);continue;}
  if(action==='finish'&&phase==='sweep'){const needed=kind==='compare'?2:Object.keys(gcCases[kind].edges).length-gcReachable(kind).length;if(swept.length!==needed)return null;done=true;continue;}
  return null;
 }
 return {selected,swept,phase,ref,done};
}
export function advanceBoxCollection(kind,history,action){const p=replayBoxCollection(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayBoxCollection(kind,next)?next:null;}
