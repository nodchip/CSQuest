import {createHttpValidationTrial,httpValidationAct} from './http-validation.js';
const sequences={unchanged:[{mode:'conditional',steps:['get','get']}],changed:[{mode:'conditional',steps:['get','update','get']}],compare:[{mode:'full',steps:['get','get','update','get']},{mode:'conditional',steps:['get','get','update','get']}]};
export function replayEtagMap(kind,history){
 if(!Object.hasOwn(sequences,kind)||!Array.isArray(history)||history.length>80)return null;
 const cases=sequences[kind],results=[];let scene=0,index=0,predicted=false,state=createHttpValidationTrial(cases[0].mode),done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===cases.length){if(kind!=='compare'||action!=='answer:revalidate')return null;done=true;continue;}
  if(action==='reset'){index=0;predicted=false;state=createHttpValidationTrial(cases[scene].mode);continue;}
  const task=cases[scene],step=task.steps[index];
  if(action==='next'&&index===task.steps.length&&!predicted){results.push({mode:task.mode,units:state.units,reports:state.reports.map(x=>({...x}))});scene++;index=0;predicted=false;if(scene<cases.length)state=createHttpValidationTrial(cases[scene].mode);else if(kind!=='compare')done=true;continue;}
  if(step==='get'&&!predicted){const r=httpValidationAct(state,'get');if(!r.ok||action!==`predict:${r.state.reports.at(-1).status}`)return null;predicted=true;continue;}
  if(step==='get'&&predicted&&action==='get'||step==='update'&&action==='update'){
   const r=httpValidationAct(state,action);if(!r.ok)return null;state=r.state;index++;predicted=false;continue;
  }
  return null;
 }
 return {scene,index,predicted,mode:cases[scene]?.mode??null,nextStep:cases[scene]?.steps[index]??null,state,results,done};
}
