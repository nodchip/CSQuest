import {mutationInputs,mutationResults} from './mutation-coverage.js';
export function replayGateTests(kind,history){
 if(!['outcomes','lower','both'].includes(kind)||!Array.isArray(history)||history.length>60)return null;
 let selected=[],ran=false,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){selected=[];ran=false;continue;}
  if(action==='run'){if(!selected.length)return null;ran=true;continue;}
  if(action==='check'){if(!ran)return null;const r=mutationResults(selected);if(kind==='outcomes'?!(r.accepted&&r.rejected&&(!r.lowerCaught||!r.upperCaught)):kind==='lower'?!r.lowerCaught:!(r.accepted&&r.rejected&&r.lowerCaught&&r.upperCaught))return null;done=true;continue;}
  const m=/^toggle:(0|1|2|5|6)$/.exec(action);if(!m)return null;
  const n=Number(m[1]);if(!mutationInputs.includes(n))return null;
  if(selected.includes(n))selected=selected.filter(x=>x!==n);else {if(selected.length===3)return null;selected=[...selected,n].sort((a,b)=>a-b);}ran=false;
 }
 return {selected,ran,done,results:ran?mutationResults(selected):null};
}
