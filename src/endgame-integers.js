export const weights=[8,4,2,1];
export const unsignedTargets=[0,5,13,15];
export const readingCases=[
 {bits:15,mode:'unsigned',options:[-1,15,7]},
 {bits:15,mode:'signed',options:[15,7,-1]},
 {bits:7,mode:'signed',options:[7,-1,-8]},
 {bits:8,mode:'signed',options:[8,-8,0]}
];
export const additionCases=[{a:5,b:3},{a:15,b:1},{a:8,b:15}];
export const signed4=n=>n<8?n:n-16;
export function add4(a,b){
 if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||a>15||b<0||b>15)return null;
 const raw=a+b,value=raw%16,signedSum=signed4(a)+signed4(b);
 return {value,carry:raw>=16,signedOverflow:signedSum<-8||signedSum>7,signedSum};
}
export function replayIntegers(kind,history){
 if(!['unsigned','reading','addition'].includes(kind)||!Array.isArray(history))return null;
 const tasks=kind==='unsigned'?unsignedTargets:kind==='reading'?readingCases:additionCases;
 let scene=0,bits=0,choice=null,carry=null,overflow=null;const results=[];
 for(const action of history){
  const task=tasks[scene];if(task===undefined||typeof action!=='string')return null;
  const toggle=/^toggle:([0-3])$/.exec(action);
  if(toggle&&kind!=='reading')bits^=weights[Number(toggle[1])];
  else if(kind==='reading'&&/^choose:-?\d+$/.test(action)&&task.options.includes(Number(action.slice(7))))choice=Number(action.slice(7));
  else if(kind==='addition'&&/^carry:(yes|no)$/.test(action))carry=action==='carry:yes';
  else if(kind==='addition'&&/^overflow:(yes|no)$/.test(action))overflow=action==='overflow:yes';
  else if(action==='check'){
   const result=kind==='addition'?add4(task.a,task.b):null;
   const expected=kind==='unsigned'?task:kind==='reading'?(task.mode==='signed'?signed4(task.bits):task.bits):result.value;
   if(kind==='reading'?choice!==expected:bits!==expected)return null;
   if(result&&(carry!==result.carry||overflow!==result.signedOverflow))return null;
   results.push(kind==='addition'?result:{value:expected});scene++;bits=0;choice=null;carry=null;overflow=null;
  }else return null;
 }
 return {scene,bits,choice,carry,overflow,results,done:scene===tasks.length};
}
