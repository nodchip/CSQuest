import {spanSum,spanCases} from './vector-span.js';
const options=['2,1','2,0','0,1','1,0'];
export function replaySpanJourney(kind,history){
 if(!['basis','repeat','outside'].includes(kind)||!Array.isArray(history)||history.length>8)return null;
 let attempts=[],reason=false,done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  const m=/^try:(2,1|2,0|0,1|1,0)$/.exec(action);
  if(m&&!reason&&!attempts.includes(m[1])){attempts.push(m[1]);continue;}
  const hits=attempts.filter(x=>{const out=spanSum(kind,...x.split(',').map(Number));return out.every((n,i)=>n===spanCases[kind].target[i]);}).length;
  if(kind==='outside'&&action==='reason:equal'&&attempts.length>=2&&!reason){reason=true;continue;}
  const ready=kind==='basis'?hits>=1:kind==='repeat'?hits>=2:reason;
  if(ready&&action===`answer:${kind==='basis'?'independent':'dependent'}`){done=true;continue;}return null;
 }
 return {attempts,reason,done,results:attempts.map(x=>({pair:x.split(',').map(Number),sum:spanSum(kind,...x.split(',').map(Number))})),options};
}
export function advanceSpanJourney(kind,history,action){const p=replaySpanJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replaySpanJourney(kind,next)?next:null;}
