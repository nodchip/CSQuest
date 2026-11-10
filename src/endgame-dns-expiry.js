import {dnsExperiment} from './dns-resolution.js';
export const dnsExpiryScenes={short:[{ttl:2,time:1},{ttl:2,time:3}],long:[{ttl:4,time:1},{ttl:4,time:3},{ttl:4,time:4}],compare:[{ttl:2,time:3},{ttl:4,time:3}]};
export function replayDnsExpiry(kind,history){
 if(!Object.hasOwn(dnsExpiryScenes,kind)||!Array.isArray(history)||history.length>20)return null;
 const scenes=dnsExpiryScenes[kind],results=[];let scene=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===scenes.length){if(kind!=='compare'||action!=='compare:long')return null;done=true;continue;}
  const current=scenes[scene],result=dnsExperiment(current.time,current.ttl),expected=result.answer==='192.0.2.42'?'answer:old':'answer:new';
  if(action!==expected)return null;
  results.push({...current,...result});scene++;if(scene===scenes.length&&kind!=='compare')done=true;
 }
 return {scene,results,done};
}
