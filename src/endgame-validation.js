export const boundaryCases=[{fault:'reject-one'},{fault:'accept-four'}];
export function expectedAcceptance(n){return Number.isInteger(n)&&n>=1&&n<=3;}
export function boundaryDevice(fault,n){
 if(!['reject-one','accept-four'].includes(fault)||!Number.isInteger(n)||n<0||n>4)return null;
 return fault==='reject-one'?n>=2&&n<=3:n>=1&&n<=4;
}
export function replayBoundary(history){
 if(!Array.isArray(history))return null;let scene=0,last=null,trials=[],results=[];
 for(const action of history){
  const task=boundaryCases[scene];if(!task||typeof action!=='string')return null;
  const match=/^try:([0-4])$/.exec(action);
  if(match){const n=Number(match[1]);last=n;trials.push({n,expected:expectedAcceptance(n),actual:boundaryDevice(task.fault,n)});}
  else if(/^report:[0-4]$/.test(action)){const n=Number(action.slice(7));if(!trials.some(t=>t.n===n)||boundaryDevice(task.fault,n)===expectedAcceptance(n))return null;results.push({n,expected:expectedAcceptance(n),actual:boundaryDevice(task.fault,n)});scene++;last=null;trials=[];}
  else return null;
 }
 return {scene,last,trials,results,done:scene===boundaryCases.length};
}
// These examples limit the question to integer quantities 1 through 4.
export const validationCases=[
 {need:4,spec:3,device:3,answer:'spec-only'},
 {need:4,spec:4,device:3,answer:'neither'},
 {need:4,spec:4,device:4,answer:'both'}
];
export function replayValidation(history){
 if(!Array.isArray(history))return null;let scene=0,trials=[],results=[];
 for(const action of history){
  const task=validationCases[scene];if(!task||typeof action!=='string')return null;
  const match=/^try:([1-4])$/.exec(action);
  if(match){const n=Number(match[1]);if(!trials.includes(n))trials.push(n);}
  else if(action===`answer:${task.answer}`&&[1,2,3,4].every(n=>trials.includes(n))){results.push(task.answer);scene++;trials=[];}
  else return null;
 }
 return {scene,trials,results,done:scene===validationCases.length};
}
export function regressionDevice(version,n){
 if(!['old','changed','fixed'].includes(version)||!Number.isInteger(n)||n<0||n>5)return null;
 if(version==='old')return n>=1&&n<=3;
 if(version==='changed')return n===1||n===2||n===4;
 return n>=1&&n<=4;
}
export function replayRegression(history){
 if(!Array.isArray(history))return null;let scene=0,trials=[];const results=[];
 for(const action of history){
  if(scene>=3||typeof action!=='string')return null;
  const match=/^try:(old|changed|fixed):([0-5])$/.exec(action);
  if(match){const version=match[1],n=Number(match[2]);if(scene<2&&version==='fixed'||scene===2&&version!=='fixed')return null;if(!trials.some(t=>t.version===version&&t.n===n))trials.push({version,n,actual:regressionDevice(version,n)});}
  else{
   const seen=(version,n)=>trials.some(t=>t.version===version&&t.n===n);
   const ok=scene===0&&action==='answer:planned'&&seen('old',4)&&seen('changed',4)||scene===1&&action==='answer:regression'&&seen('old',3)&&seen('changed',3)||scene===2&&action==='answer:limited'&&[0,3,4,5].every(n=>seen('fixed',n));
   if(!ok)return null;results.push({scene,trials});scene++;trials=[];
  }
 }
 return {scene,trials,results,done:scene===3};
}
