import {pagerankStep} from './pagerank.js';
export function replayPagerankJourney(kind,history){
 if(!['east','west','compare'].includes(kind)||!Array.isArray(history)||history.length>6)return null;
 let distribution=[1/3,1/3,1/3],steps=0,answered=0,seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(east|west)$/.exec(action);if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:fixed'&&seen.length===2){done=true;continue;}return null;
  }
  if(action==='step'&&steps===answered&&steps<2){distribution=pagerankStep(kind,distribution);steps++;continue;}
  const target=steps===1?'moon':kind==='east'?'sun':'star';
  if(steps===answered+1&&action===`answer:${target}`){answered++;if(answered===2)done=true;continue;}
  return null;
 }
 return {distribution,steps,answered,seen,done};
}
export function advancePagerankJourney(kind,history,action){const p=replayPagerankJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayPagerankJourney(kind,next)?next:null;}
