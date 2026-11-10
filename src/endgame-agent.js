export const weatherCases=['sun','rain'];
export const riskCases=[{rain:20,outside:2,shelter:3,answer:'outside'},{rain:50,outside:5,shelter:3,answer:'shelter'}];
export function replayAgent(kind,history){
 if(!['rule','observe','risk'].includes(kind)||!Array.isArray(history))return null;
 let rules={sun:null,rain:null},trials={},scene=0,cloud=false,sensor=false,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){if(kind==='rule'){rules={sun:null,rain:null};trials={};}else{cloud=false;sensor=false;}continue;}
  if(kind==='rule'){
   const m=/^set:(sun|rain):(outside|shelter)$/.exec(action);
   if(m){rules[m[1]]=m[2];trials={};continue;}
   const t=/^test:(sun|rain)$/.exec(action);
   if(t&&rules[t[1]]){trials[t[1]]=rules[t[1]];continue;}
   if(action==='check'&&rules.sun==='outside'&&rules.rain==='shelter'&&weatherCases.every(x=>Object.hasOwn(trials,x))){done=true;continue;}
   return null;
  }
  if(kind==='observe'){
   if(action==='cloud'){cloud=true;continue;}
   if(action==='sensor'&&cloud){sensor=true;continue;}
   const expected=weatherCases[scene]==='sun'?'outside':'shelter';
   if(action===`choose:${expected}`&&sensor){scene++;done=scene===weatherCases.length;cloud=false;sensor=false;continue;}
   return null;
  }
  if(action===`choose:${riskCases[scene].answer}`){scene++;done=scene===riskCases.length;continue;}
  return null;
 }
 return {rules,trials,scene,cloud,sensor,done};
}
