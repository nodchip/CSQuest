import {orthogonalCases,orthogonalResult} from './orthogonal-projection.js';
export const rayProjectionValues=[0,1,1.5,2,3];
export function replayRayProjection(kind, history){
 if(!['axis','diagonal','compare'].includes(kind)||!Array.isArray(history)||history.length>60)return null;
 const cases=kind==='compare'?['axis','diagonal']:[kind],results=[];let scene=0,trials=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===cases.length){if(kind!=='compare'||action!=='answer:perpendicular')return null;done=true;continue;}
  if(action==='reset'){trials=[];continue;}
  const match=/^(trial|choose):(0|1|1\.5|2|3)$/.exec(action);if(!match)return null;
  const value=Number(match[2]);
  if(match[1]==='trial'){if(trials.includes(value))return null;trials.push(value);continue;}
  const current=cases[scene],best=orthogonalCases[current].best;
  if(value!==best||!trials.includes(best)||!trials.some(t=>t!==best))return null;
  results.push({id:current,value,...orthogonalResult(current,value)});scene++;trials=[];if(scene===cases.length&&kind!=='compare')done=true;
 }
 return {scene,current:cases[scene]??null,trials,results,done};
}
