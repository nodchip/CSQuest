import {baseRateTable} from './base-rate.js';
export function replayWarningPrior(kind,history){
 if(!['rare','common','compare'].includes(kind)||!Array.isArray(history)||history.length>40)return null;
 const modes=kind==='compare'?['rare','common']:[kind],results=[];let scene=0,phase=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(kind!=='compare'||action!=='answer:prior')return null;done=true;continue;}
  if(action==='reset'){phase=0;continue;}
  if(phase===0&&action==='numerator:tp'){phase=1;continue;}
  if(phase===1&&action==='denominator:alarm'){phase=2;continue;}
  if(phase===2&&action==='next'){
   const table=baseRateTable(modes[scene]);results.push({mode:modes[scene],fault:table.fault,tp:table.tp,fp:table.fp,alarm:table.alarm});scene++;phase=0;if(scene===modes.length&&kind!=='compare')done=true;continue;
  }
  return null;
 }
 return {scene,mode:modes[scene]??null,phase,results,done};
}
