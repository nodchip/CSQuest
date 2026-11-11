import {bloomBits,bloomMaybe,bloomStored,bloomKeys} from './bloom-scroll.js';

// Each quest is independent: both keys are registered in this fixed example.
export function replayBloomJourney(kind,history){
 if(!['register','absent','candidate'].includes(kind)||!Array.isArray(history)||history.length>8)return null;
 let inserted=[],checked=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  const insert=/^insert:(moon|antidote)$/.exec(action);
  if(insert&&!inserted.includes(insert[1])&&checked.length===0){inserted.push(insert[1]);continue;}
  if(inserted.length!==2)return null;
  const inspect=/^inspect:(moon|herb|fire)$/.exec(action);
  if(inspect&&!checked.includes(inspect[1])){checked.push(inspect[1]);continue;}
  if(kind==='register'&&action==='answer:maybe'&&checked.includes('moon')){done=true;continue;}
  if(kind==='absent'&&action==='answer:absent'&&checked.includes('fire')){done=true;continue;}
  if(kind==='candidate'&&action==='answer:verify'&&checked.includes('herb')){done=true;continue;}
  return null;
 }
 return {inserted,checked,done,bits:bloomBits(inserted),results:Object.fromEntries(checked.map(id=>[id,bloomMaybe(inserted,id)])),stored:bloomStored,keys:bloomKeys};
}
export function advanceBloomJourney(kind,history,action){
 const p=replayBloomJourney(kind,history);if(!p||p.done)return null;
 const next=action==='reset'?[]:[...history,action];return replayBloomJourney(kind,next)?next:null;
}
