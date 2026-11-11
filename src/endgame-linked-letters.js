import {createLinkedTrial,stepLinked,linkedReach,linkedCorrect} from './linked-list.js';
const links={insert:['A:X','X:B','A:B'],remove:['A:C','B:end','A:B']};
export function replayLinkedLetters(kind,history){
 if(!['insert','remove','compare'].includes(kind)||!Array.isArray(history)||history.length>60)return null;
 let state=createLinkedTrial(kind==='remove'?'remove':'insert'),phase=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind==='compare'&&phase===1){if(action!=='inspect')return null;phase=2;continue;}
  if(kind==='compare'&&phase===2){if(action!=='reset')return null;state=createLinkedTrial('insert');phase=3;continue;}
  if(kind==='compare'&&phase===4){if(action!=='answer:keep')return null;done=true;continue;}
  if(action==='reset'&&(kind!=='compare'||phase===3)){state=createLinkedTrial(kind==='compare'?'insert':kind);continue;}
  if(action==='check'){
   if(kind==='compare'&&phase!==3)return null;
   if(!linkedCorrect({...state,checked:true}))return null;
   if(kind==='compare')phase=4;else done=true;continue;
  }
  const m=/^link:([A-Z]):([A-Z]+|end)$/.exec(action),id=kind==='remove'?'remove':'insert';
  if(!m||!links[id].includes(`${m[1]}:${m[2]}`)||kind==='compare'&&phase===0&&action!=='link:A:X')return null;
  let next;try{next=stepLinked(state,m[1],m[2]);}catch{return null;}if(next.history.length!==state.history.length+1)return null;
  state=next;if(kind==='compare'&&phase===0)phase=1;
 }
 return {state,phase,reach:linkedReach(state),done};
}
