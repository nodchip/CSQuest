import {hashResizeBuild,hashResizeSearch} from './hash-resize-workshop.js';
const operations={copy:['place:1:1','place:4:2','place:7:0','probe:4','answer:missing'],rehash:['place:1:1','place:4:4','place:7:0','probe:4','answer:found']};
function snapshot(mode,step){const final=hashResizeBuild(mode).after,slots=Array(7).fill(null);if(step>=1)slots[1]=1;if(step>=2)slots[mode==='copy'?2:4]=4;if(step>=3)slots[0]=7;return {slots,found:step>=4?hashResizeSearch(final,4).found:null,visited:step>=4?[4]:[]};}
export function replayShelfResize(kind,history){
 if(!['copy','rehash','compare'].includes(kind)||!Array.isArray(history)||history.length>35)return null;
 let steps={copy:0,rehash:0},done=false;
 for(const action of history){if(typeof action!=='string'||done)return null;if(action==='reset'){steps={copy:0,rehash:0};continue;}
  if(kind==='compare'&&steps.copy===5&&steps.rehash===5&&action==='answer:rehash'){done=true;continue;}
  const m=/^(copy|rehash):(.+)$/.exec(action);if(!m||kind!=='compare'&&kind!==m[1]||m[2]!==operations[m[1]][steps[m[1]]])return null;
  steps[m[1]]++;if(kind!=='compare'&&steps[m[1]]===5)done=true;
 }
 return {steps,copy:snapshot('copy',steps.copy),rehash:snapshot('rehash',steps.rehash),done};
}
export function advanceShelfResize(kind,history,action){const p=replayShelfResize(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayShelfResize(kind,next)?next:null;}
