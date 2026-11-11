import {createShardTrial,shardStep,shardFor} from './shard-routing.js';

export function replayShardJourney(kind,history){
 if(!['parity','range','compare'].includes(kind)||!Array.isArray(history)||history.length>8)return null;
 let trial=kind==='compare'?null:createShardTrial(kind),seen=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(kind==='compare'){
   const m=/^inspect:(parity|range)$/.exec(action);
   if(m&&!seen.includes(m[1])){seen.push(m[1]);continue;}
   if(action==='answer:range'&&seen.length===2){done=true;continue;}
   return null;
  }
  let operation;const place=/^place:(K[1-4]):(left|right)$/.exec(action),query=/^query:(point|range):(left|right|both)$/.exec(action);
  if(place)operation=['place',place[1],place[2]];
  else if(query)operation=['query',query[1],query[2]==='both'?['left','right']:[query[2]]];
  else return null;
  const next=shardStep(trial,operation);if(next.history.length!==trial.history.length+1)return null;trial=next;done=trial.stage==='done';
 }
 return {trial,seen,done,compare:seen.map(mode=>({mode,places:Object.fromEntries(['K1','K2','K3','K4'].map(k=>[k,shardFor(mode,k)]))}))};
}
export function advanceShardJourney(kind,history,action){
 const p=replayShardJourney(kind,history);if(!p||p.done)return null;
 const next=action==='reset'?[]:[...history,action];return replayShardJourney(kind,next)?next:null;
}
