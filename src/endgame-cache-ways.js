import {assocReplay} from './cache-associativity.js';
export function replayCacheWays(kind,history){
 if(!['direct','two','compare'].includes(kind)||!Array.isArray(history)||history.length>60)return null;
 let actions={direct:[],two:[]},confirmed={direct:false,two:false},done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){actions={direct:[],two:[]};confirmed={direct:false,two:false};continue;}
  if(kind==='compare'&&confirmed.direct&&confirmed.two&&action==='answer:two'){done=true;continue;}
  const m=/^(direct|two):(.+)$/.exec(action);if(!m||kind!=='compare'&&m[1]!==kind||confirmed[m[1]])return null;
  const mode=m[1],s=assocReplay(mode,'alternating',actions[mode]);
  if(s.index===4){if(m[2]!==`answer:${mode==='direct'?4:2}`)return null;confirmed[mode]=true;if(kind!=='compare')done=true;continue;}
  if(s.index>4)return null;try{assocReplay(mode,'alternating',[...actions[mode],m[2]]);}catch{return null;}actions[mode].push(m[2]);
 }
 return {direct:assocReplay('direct','alternating',actions.direct),two:assocReplay('two','alternating',actions.two),confirmed,done};
}
export function advanceCacheWays(kind,history,action){const p=replayCacheWays(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayCacheWays(kind,next)?next:null;}
