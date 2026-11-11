import {newStreamTrial,streamStep,streamDone} from './lazy-stream.js';
export function replayStreamJourney(kind,history){
 if(!['eager','lazy','infinite'].includes(kind)||!Array.isArray(history)||history.length>6)return null;
 let first=newStreamTrial(),second=kind==='infinite'?newStreamTrial():null,done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='infinite'&&action==='answer:prefix'&&first.stuck&&streamDone('infiniteLazy',second)){done=true;continue;}
  let id,target,op;
  if(kind==='infinite'){
   const m=/^(eager|lazy):(prepare|take)$/.exec(action);if(!m)return null;
   id=m[1]==='eager'?'infiniteEager':'infiniteLazy';target=m[1]==='eager'?first:second;op=m[2];
  }else{if(!['prepare','take'].includes(action))return null;id=kind==='eager'?'finiteEager':'finiteLazy';target=first;op=action;}
  const next=streamStep(id,target,op);if(next.history.length!==target.history.length+1)return null;
  if(kind==='infinite'&&id==='infiniteLazy')second=next;else first=next;
  if(kind!=='infinite'&&streamDone(id,first))done=true;
 }
 return {first,second,done,ready:kind==='infinite'&&first.stuck&&streamDone('infiniteLazy',second)};
}
export function advanceStreamJourney(kind,history,action){const p=replayStreamJourney(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayStreamJourney(kind,next)?next:null;}
