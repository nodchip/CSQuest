export const parcels=['荷１','荷２','荷３'];
export const villages=['村１','村２','村３'];
export const helpers=['人１','人２'];
export const jobs=['依１','依２'];
export const modelingOneCases=[{'荷１':'村１','荷２':'村１','荷３':'村２'},{'荷１':'村２','荷２':'村３','荷３':'村２'}];
export const modelingManyCases=[['人１:依１','人１:依２','人２:依１'],['人１:依２','人２:依１','人２:依２']];
export const modelingLookupCases=[{pairs:modelingManyCases[0],job:'依２',duplicate:'人１:依２'},{pairs:modelingManyCases[1],job:'依２',duplicate:'人２:依２'}];
export function replayModeling(kind,history){
 if(!['one','many','lookup'].includes(kind)||!Array.isArray(history))return null;
 let assignments={},pairs=[],selected=[],duplicate=false,missing=false,scene=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){assignments={};pairs=[];selected=[];duplicate=false;missing=false;continue;}
  if(kind==='one'){
   const m=/^set:(荷[１２３]):(村１|村２|村３)$/.exec(action);
   if(m){assignments[m[1]]=m[2];continue;}
   if(action==='check'&&parcels.every(x=>assignments[x]===modelingOneCases[scene][x])){scene++;done=scene===modelingOneCases.length;assignments={};continue;}
   return null;
  }
  if(kind==='many'){
   const m=/^pair:(人１|人２):(依１|依２)$/.exec(action);
   if(m){const v=`${m[1]}:${m[2]}`;pairs=pairs.includes(v)?pairs.filter(x=>x!==v):[...pairs,v];continue;}
   const required=modelingManyCases[scene];
   if(action==='check'&&pairs.length===required.length&&required.every(x=>pairs.includes(x))){scene++;done=scene===modelingManyCases.length;pairs=[];continue;}
   return null;
  }
  if(action==='duplicate'){duplicate=true;continue;}
  if(action==='missing'){missing=true;continue;}
  const m=/^select:(人１|人２)$/.exec(action);
  if(m){selected=selected.includes(m[1])?selected.filter(x=>x!==m[1]):[...selected,m[1]];continue;}
  const expected=modelingLookupCases[scene].pairs.filter(x=>x.endsWith(`:${modelingLookupCases[scene].job}`)).map(x=>x.split(':')[0]);
  if(action==='check'&&duplicate&&missing&&selected.length===expected.length&&expected.every(x=>selected.includes(x))){scene++;done=scene===modelingLookupCases.length;selected=[];duplicate=false;missing=false;continue;}
  return null;
 }
 return {assignments,pairs,selected,duplicate,missing,scene,done};
}
