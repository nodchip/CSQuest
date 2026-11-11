import {createRadixTrial,stepRadix} from './radix-sort.js';
export function replayRadixParcel(kind,history){
 if(!['ones','full','stable'].includes(kind)||!Array.isArray(history)||history.length>35)return null;
 const id=kind==='full'?'second':'first';let trial=createRadixTrial(id),done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){trial=createRadixTrial(id);continue;}
  if(action==='check'){if(kind==='ones'?!(trial.pass==='tens'&&trial.cursor===0):kind==='full'?trial.pass!=='done':true)return null;done=true;continue;}
  if(action==='answer:BE'){if(kind!=='stable'||trial.pass!=='done')return null;done=true;continue;}
  if(kind==='ones'&&trial.pass==='tens'||!/^bucket:[0-3]$|^gather$/.test(action))return null;
  const next=stepRadix(trial,action);if(next.history.length!==trial.history.length+1)return null;trial=next;
 }
 return {trial,done};
}

// Reset starts a new saved history rather than consuming the history limit.
export function advanceRadixParcel(kind,history,action){
 const current=replayRadixParcel(kind,history);if(!current||current.done)return null;
 const next=action==='reset'?[]:[...history,action];
 return replayRadixParcel(kind,next)?next:null;
}
