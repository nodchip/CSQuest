import {primState} from './prim-tree.js';
export function replayPrimRoads(kind,history){
 if(!['forest','ties','compare'].includes(kind)||!Array.isArray(history)||history.length>60)return null;
 const cases=kind==='compare'?['forest','ties']:[kind],results=[];let scene=0,edges=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===cases.length){if(kind!=='compare'||action!=='answer:spanning')return null;done=true;continue;}
  if(action==='reset'){edges=[];continue;}
  let state;try{state=primState(cases[scene],edges);}catch{return null;}
  if(action==='next'){
   if(!state.done)return null;results.push({case:cases[scene],chosen:[...state.chosen],total:state.total});scene++;edges=[];if(scene===cases.length&&kind!=='compare')done=true;continue;
  }
  const m=/^edge:([A-E]{2})$/.exec(action);if(!m||state.done)return null;
  try{primState(cases[scene],[...edges,m[1]]);}catch{return null;}edges.push(m[1]);
 }
 return {scene,current:cases[scene]??null,state:scene<cases.length?primState(cases[scene],edges):null,results,done};
}
