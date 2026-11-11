export const samplePairs=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
export const sampleValues=[2,2,6,6];
export function replaySamplingBias(kind,history){
 if(!['near','pairs','compare'].includes(kind)||!Array.isArray(history)||history.length>12)return null;
 let seen=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind==='near'&&action==='pick:0'&&!seen.length){seen.push(0);continue;}
  const m=/^pick:([0-5])$/.exec(action);
  if(kind==='pairs'&&m&&!seen.includes(Number(m[1]))){seen.push(Number(m[1]));continue;}
  if(kind==='near'&&seen.length===1&&action==='answer:2'||kind==='pairs'&&seen.length===6&&action==='answer:4'||kind==='compare'&&action==='answer:method'){done=true;continue;}
  return null;
 }
 const means=seen.map(i=>samplePairs[i].reduce((sum,j)=>sum+sampleValues[j],0)/2);
 return {seen,means,done};
}
export function advanceSamplingBias(kind,history,action){const old=replaySamplingBias(kind,history);if(!old||old.done)return null;const next=action==='reset'?[]:[...history,action];return replaySamplingBias(kind,next)?next:null;}
