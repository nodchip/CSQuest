export const ropeGcdCases={first:[48,18],second:[35,12],third:[54,24]};
export function replayRopeGcd(kind,history){
 if(!Object.hasOwn(ropeGcdCases,kind)||!Array.isArray(history)||history.length>30)return null;
 let [a,b]=ropeGcdCases[kind],trace=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){[a,b]=ropeGcdCases[kind];trace=[];continue;}
  const m=/^(remainder|answer):(0|1|3|6|11|12|18)$/.exec(action);if(!m)return null;const value=Number(m[2]);
  if(m[1]==='remainder'&&b>0&&value===a%b){trace.push({a,b,q:Math.floor(a/b),r:value});[a,b]=[b,value];continue;}
  if(m[1]==='answer'&&b===0&&value===a){done=true;continue;}return null;
 }
 return {a,b,trace,done};
}
export function advanceRopeGcd(kind,history,action){const p=replayRopeGcd(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayRopeGcd(kind,next)?next:null;}
