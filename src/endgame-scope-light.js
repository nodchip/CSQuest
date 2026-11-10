import {scopeResult} from './scope-resolution.js';
export const scopeLightScenes={lexical:[{rule:'lexical',call:'direct'},{rule:'lexical',call:'room'}],dynamic:[{rule:'dynamic',call:'direct'},{rule:'dynamic',call:'room'}],compare:[{rule:'lexical',call:'room'},{rule:'dynamic',call:'room'}]};
export function replayScopeLight(kind,history){
 if(!Object.hasOwn(scopeLightScenes,kind)||!Array.isArray(history)||history.length>20)return null;
 const scenes=scopeLightScenes[kind],results=[];let scene=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===scenes.length){if(kind!=='compare'||action!=='answer:dynamic')return null;done=true;continue;}
  const item=scenes[scene],answer=scopeResult(item.rule,item.call);if(action!==`box:${answer}`)return null;
  results.push({...item,answer,value:answer==='workshop'?1:2});scene++;if(scene===scenes.length&&kind!=='compare')done=true;
 }
 return {scene,results,done};
}
