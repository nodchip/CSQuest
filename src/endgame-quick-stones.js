import {quickCases,quickRun} from './quick-partition.js';
export function replayQuickStones(kind,history){
 if(!Object.hasOwn(quickCases,kind)||!Array.isArray(history)||history.length>80)return null;
 let moves=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){moves=[];continue;}
  if(action==='check'){if(!quickRun(kind,moves).done)return null;done=true;continue;}
  if(!['less','equal','greater'].includes(action))return null;
  try{quickRun(kind,[...moves,action]);}catch{return null;}
  moves.push(action);
 }
 return {trial:quickRun(kind,moves),done};
}
