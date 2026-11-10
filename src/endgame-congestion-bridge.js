// Fixed one-sender model; not a TCP implementation.
export const congestionBridgeCases={grow:{start:1,rounds:2},loss:{start:3,rounds:1},recover:{start:1,rounds:4}};
export function replayCongestionBridge(kind,history){
 if(!Object.hasOwn(congestionBridgeCases,kind)||!Array.isArray(history))return null;
 const task=congestionBridgeCases[kind];let window=task.start,round=0,pending=null,results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){window=task.start;round=0;pending=null;results=[];continue;}
  if(action==='check'){if(round!==task.rounds||pending!==null)return null;done=true;continue;}
  if(round===task.rounds)return null;
  if(pending===null){if(action!=='send')return null;pending={sent:window,delivered:window<=2?window:0,congested:window>2};continue;}
  const expected=pending.congested?'adjust:half':'adjust:up';if(action!==expected)return null;
  window=pending.congested?Math.max(1,Math.floor(window/2)):window+1;results.push({...pending,next:window});pending=null;round++;
 }
 return {window,round,pending,results,done};
}
