// Controlled examples: successful identity verification is assumed reliable.
export const accessCases=[
 {name:'ミナ',verified:true,rights:['read'],until:5,time:2,operation:'read'},
 {name:'レン',verified:true,rights:[],until:5,time:2,operation:'read'},
 {name:'ユノ',verified:false,rights:['read'],until:5,time:2,operation:'read'},
 {name:'アルト',verified:true,rights:['read'],until:2,time:2,operation:'read'},
 {name:'ハル',verified:true,rights:['read'],until:5,time:2,operation:'write'},
 {name:'シノ',verified:true,rights:['write'],until:5,time:2,operation:'write'},
 {name:'ゲン',verified:true,rights:['read'],until:2,time:3,operation:'read'}
];
export function replayAccess(history){
 if(!Array.isArray(history))return null;
 let scene=0,identityChecked=false,rightsChecked=false;const results=[];
 for(const action of history){
  const s=accessCases[scene];if(!s||typeof action!=='string')return null;
  if(action==='identity'){identityChecked=true;continue;}
  if(action==='rights'){rightsChecked=true;continue;}
  const allowed=s.verified&&s.time<s.until&&s.rights.includes(s.operation);
  if(!identityChecked||!rightsChecked||action!==(allowed?'allow':'deny'))return null;
  results.push(allowed);scene++;identityChecked=false;rightsChecked=false;
 }
 return {scene,identityChecked,rightsChecked,results,done:scene===accessCases.length};
}
