import {sharingReplay} from './false-sharing.js';
const patterns={alternate:['A','B','A','B'],grouped:['A','A','B','B']};
export function replaySharingShelves(kind,history){
 if(!['packed','separate','compare'].includes(kind)||!Array.isArray(history)||history.length>30)return null;
 let steps={alternate:[],grouped:[]},done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){steps={alternate:[],grouped:[]};continue;}
  const m=/^(alternate|grouped):(A|B)$/.exec(action);
  if(m){if(kind!=='compare'&&m[1]!=='alternate'||steps[m[1]].length>=4||patterns[m[1]][steps[m[1]].length]!==m[2])return null;steps[m[1]].push(m[2]);continue;}
  if(kind==='compare'){if(steps.alternate.length!==4||steps.grouped.length!==4||action!=='answer:1')return null;}
  else {if(steps.alternate.length!==4||action!==(kind==='packed'?'answer:3':'answer:0'))return null;}
  done=true;
 }
 const layout=kind==='separate'?'separate':'packed';
 return {steps,alternate:sharingReplay(layout,steps.alternate),grouped:sharingReplay('packed',steps.grouped),done};
}
