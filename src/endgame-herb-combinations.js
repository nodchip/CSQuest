export const combinationPairs=['AB','AC','AD','BC','BD','CD'];
export function replayHerbCombinations(kind,history){
 if(!['list','sort','triangle'].includes(kind)||!Array.isArray(history)||history.length>12)return null;
 let seen=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  let m=/^pair:([0-5])$/.exec(action);
  if(kind==='list'&&m&&!seen.includes(Number(m[1]))){seen.push(Number(m[1]));continue;}
  m=/^sort:([0-5]):(with|without)$/.exec(action);
  if(kind==='sort'&&m&&!seen.includes(Number(m[1]))&&combinationPairs[Number(m[1])].includes('D')===(m[2]==='with')){seen.push(Number(m[1]));continue;}
  if(kind==='list'&&seen.length===6&&action==='answer:6'||kind==='sort'&&seen.length===6&&action==='answer:3+3'||kind==='triangle'&&action==='answer:6'){done=true;continue;}
  return null;
 }
 return {seen,done};
}
export function advanceHerbCombinations(kind,history,action){const old=replayHerbCombinations(kind,history);if(!old||old.done)return null;const next=action==='reset'?[]:[...history,action];return replayHerbCombinations(kind,next)?next:null;}
