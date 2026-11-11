import {confidenceInterval} from './confidence-interval.js';
export function replayIntervalSamples(kind,history){
 if(!['inside','outside','coverage'].includes(kind)||!Array.isArray(history)||history.length>40)return null;
 let seen=[],sampled=false,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){seen=[];sampled=false;continue;}
  if(kind!=='coverage'&&action==='sample'&&!sampled){sampled=true;continue;}
  if(kind==='inside'&&sampled&&action==='answer:inside'||kind==='outside'&&sampled&&action==='answer:outside'){done=true;continue;}
  const m=/^probe:([0-3]):([0-3])$/.exec(action);
  if(kind==='coverage'&&m){const k=`${m[1]}:${m[2]}`;if(seen.includes(k))return null;seen.push(k);continue;}
  if(kind==='coverage'&&seen.length===16&&action==='answer:10'){done=true;continue;}
  return null;
 }
 const pair=kind==='inside'?[0,3]:[0,0],sample=kind==='coverage'?null:confidenceInterval(4.5,...pair,0.5),covered=seen.filter(k=>{const [a,b]=k.split(':').map(Number);return confidenceInterval(4.5,a,b,0.5).contains;}).length;
 return {seen,sampled,sample,covered,done};
}
export function advanceIntervalSamples(kind,history,action){const p=replayIntervalSamples(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayIntervalSamples(kind,next)?next:null;}
