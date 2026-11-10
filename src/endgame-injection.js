// These fixed examples model one SQLite equality query; this is not a SQL parser.
export const injectionSamples=['アオ',"オ'ハル","アオ' OR 1=1 -- "];
export const exampleNames=['アオ','ビー',"オ'ハル"];
export function injectionExample(mode,index){
 if(!['concat','bound'].includes(mode)||!Number.isInteger(index)||index<0||index>=injectionSamples.length)return null;
 if(mode==='concat'&&index===1)return {error:'構文エラー'};
 if(mode==='concat'&&index===2)return {rows:[...exampleNames]};
 return {rows:exampleNames.filter(x=>x===injectionSamples[index])};
}
export function replayInjection(kind,history){
 if(!['concat','bound','choose'].includes(kind)||!Array.isArray(history))return null;
 let mode=kind==='choose'?null:kind,tested=[],answer=null,done=false;
 for(const action of history){if(done||typeof action!=='string')return null;
  if(kind==='choose'&&action.startsWith('mode:')){const next=action.slice(5);if(!['concat','bound'].includes(next))return null;mode=next;tested=[];answer=null;continue;}
  const trial=/^try:([0-2])$/.exec(action);if(trial&&mode){const n=Number(trial[1]);if(!tested.includes(n))tested.push(n);continue;}
  if(kind!=='choose'&&action.startsWith('answer:')){const next=action.slice(7);if(!['structure','literal','unrelated'].includes(next))return null;answer=next;continue;}
  if(action==='check'&&tested.length===3&&(kind==='choose'?mode==='bound':answer===(kind==='concat'?'structure':'literal'))){done=true;continue;}
  return null;
 }
 return {mode,tested,answer,done};
}
