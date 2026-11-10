import {scrolls,searchResult,searchStats} from './retrieval.js';
export function replayScrollRetrieval(kind,history){
 if(!['narrow','broad','compare'].includes(kind)||!Array.isArray(history)||history.length>80)return null;
 const modes=kind==='compare'?['narrow','broad']:[kind],selected=[],results=[];let scene=0,phase='select',done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(kind!=='compare'||action!=='answer:broad-recall')return null;done=true;continue;}
  const mode=modes[scene],stats=searchStats(mode);
  if(phase==='select'){
   if(action==='check'){const expected=searchResult(mode);if(expected.length!==selected.length||expected.some(x=>!selected.includes(x)))return null;phase='precision';}
   else {const m=/^toggle:([a-e])$/.exec(action);if(!m||!Object.hasOwn(scrolls,m[1]))return null;const i=selected.indexOf(m[1]);if(i<0)selected.push(m[1]);else selected.splice(i,1);}
  }else if(phase==='precision'){
   if(action!==`precision:${stats.hits}/${stats.returned}`)return null;phase='recall';
  }else{
   if(action!==`recall:${stats.hits}/${stats.total}`)return null;
   results.push({mode,...stats,selected:[...selected]});scene++;selected.length=0;phase='select';if(scene===modes.length&&kind!=='compare')done=true;
  }
 }
 return {mode:modes[scene]??null,scene,phase,selected,results,done};
}
