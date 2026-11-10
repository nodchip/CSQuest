import {signatureCases,verifySignature} from './signatures.js';
export const sealSignatureCases={
 integrity:[{caseId:'intact',key:'mira',answer:'valid',binding:'trusted'},{caseId:'modified',key:'mira',answer:'invalid',binding:'trusted'}],
 keys:[{caseId:'wrongkey',key:'nono',answer:'invalid',binding:'trusted'},{caseId:'other',key:'nono',answer:'valid',binding:'trusted'}],
 identity:[{caseId:'other',key:'nono',answer:'other',binding:'trusted'},{caseId:'intact',key:'mira',answer:'unknown',binding:'unverified'}],
};
export function replaySealSignature(kind,history){
 if(!Object.hasOwn(sealSignatureCases,kind)||!Array.isArray(history))return null;
 const cases=sealSignatureCases[kind];let scene=0,key=null,verified=null,results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){scene=0;key=null;verified=null;results=[];continue;}
  const task=cases[scene],m=/^key:(mira|nono)$/.exec(action);
  if(m){key=m[1];verified=null;continue;}
  if(action==='verify'){if(!key)return null;verified=verifySignature(task.caseId,key);continue;}
  if(verified===null||key!==task.key||action!==`answer:${task.answer}`)return null;
  results.push({caseId:task.caseId,key,verified,binding:task.binding,answer:task.answer});scene++;key=null;verified=null;done=scene===cases.length;
 }
 return {scene,key,verified,results,done};
}
export {signatureCases};
