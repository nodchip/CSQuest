const colors=['red','blue','green'];
export function replayGardenConstraint(kind,history){
 if(!['chain','triangle','three'].includes(kind)||!Array.isArray(history)||history.length>35)return null;
 let domains={A:['red','blue'],B:['red','blue'],C:['red']},revised=[],tried=[],assigned=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){domains={A:['red','blue'],B:['red','blue'],C:['red']};revised=[];tried=[];assigned=[];continue;}
  if(kind==='chain'&&action==='revise:BC'&&!revised.includes('BC')){domains.B=domains.B.filter(x=>domains.C.some(y=>x!==y));revised.push('BC');continue;}
  if(kind==='chain'&&action==='revise:AB'&&revised.includes('BC')&&!revised.includes('AB')){domains.A=domains.A.filter(x=>domains.B.some(y=>x!==y));revised.push('AB');continue;}
  if(kind==='chain'&&action==='check'&&revised.includes('BC')&&revised.includes('AB')){done=true;continue;}
  if(kind==='triangle'&&/^try:(red|blue)$/.test(action)){const c=action.slice(4);if(tried.includes(c))return null;tried.push(c);continue;}
  if(kind==='triangle'&&action==='answer:none'&&tried.length===2){done=true;continue;}
  const m=/^set:(A|B|C):(red|blue|green)$/.exec(action);
  if(kind==='three'&&m&&m[1]==='ABC'[assigned.length]&&colors.includes(m[2])&&!assigned.includes(m[2])){assigned.push(m[2]);continue;}
  if(kind==='three'&&action==='check'&&assigned.length===3){done=true;continue;}
  return null;
 }
 return {domains,revised,tried,assigned,done};
}
