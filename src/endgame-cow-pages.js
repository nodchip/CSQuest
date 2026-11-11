import {cowSnapshot} from './copy-on-write.js';
export function replayCowPages(kind,history){
 if(!['shared','cow','compare'].includes(kind)||!Array.isArray(history)||history.length>30)return null;
 let stages={shared:0,cow:0},done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){stages={shared:0,cow:0};continue;}
  const m=/^(shared|cow):(fork|write|copy)$/.exec(action);
  if(m){const mode=m[1],s=stages[mode];if(kind!=='compare'&&kind!==mode)return null;if(m[2]==='fork'&&s===0)stages[mode]=1;else if(m[2]==='write'&&s===1)stages[mode]=mode==='cow'?2:3;else if(m[2]==='copy'&&mode==='cow'&&s===2)stages[mode]=3;else return null;continue;}
  if(kind==='shared'&&stages.shared===3&&action==='answer:9'||kind==='cow'&&stages.cow===3&&action==='answer:7'||kind==='compare'&&stages.shared===3&&stages.cow===3&&action==='answer:private'){done=true;continue;}
  return null;
 }
 return {stages,shared:cowSnapshot('shared',stages.shared),cow:cowSnapshot('cow',stages.cow),done};
}
export function advanceCowPages(kind,history,action){const p=replayCowPages(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayCowPages(kind,next)?next:null;}
