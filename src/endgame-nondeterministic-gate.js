import {subsetNext} from './subset-automaton.js';
export const nondeterministicWords={one:['a'],accept:['a','b'],reject:['a','b','a']};
export function replayNondeterministicGate(kind,history){
 if(!Object.hasOwn(nondeterministicWords,kind)||!Array.isArray(history)||history.length>50)return null;
 let mask=1,selected=0,index=0,trace=[1],done=false;const word=nondeterministicWords[kind];
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){mask=1;selected=0;index=0;trace=[1];continue;}
  const m=/^toggle:(1|2|4)$/.exec(action);if(m&&index<word.length){selected^=Number(m[1]);continue;}
  if(action==='check'&&index<word.length&&selected===subsetNext(mask,word[index])){mask=selected;trace.push(mask);selected=0;index++;continue;}
  if(index===word.length&&action===((mask&4)?'answer:accept':'answer:reject')){done=true;continue;}return null;
 }
 return {mask,selected,index,trace,done};
}
export function advanceNondeterministicGate(kind,history,action){const p=replayNondeterministicGate(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayNondeterministicGate(kind,next)?next:null;}
