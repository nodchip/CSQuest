const initial=(overrides={})=>({location:'入口',shelf:true,held:false,door:false,parcel:true,delivered:false,...overrides});
export const planningCases={
 rules:[initial(),initial({shelf:false,held:true}),initial({shelf:false,held:true,door:true}),initial({shelf:false,held:true,door:true,location:'庭'}),initial({shelf:false,held:true,door:true,location:'庭',parcel:false,delivered:true})],
 steps:[{start:initial(),goal:'door'},{start:initial({shelf:false,held:true}),goal:'arrived'}],
 plan:[{start:initial(),goal:'delivered'},{start:initial({door:true}),goal:'delivered'}]
};
export const planningActions=['take','open','pass','deliver'];
export function planningApplicable(s,a){
 if(!s)return false;
 return a==='take'?s.location==='入口'&&s.shelf&&!s.held:a==='open'?s.location==='入口'&&s.held&&!s.door:a==='pass'?s.location==='入口'&&s.door:a==='deliver'?s.location==='庭'&&s.parcel&&!s.delivered:false;
}
export function planningApply(s,a){
 if(!planningApplicable(s,a))return null;const next={...s};
 if(a==='take'){next.shelf=false;next.held=true;}else if(a==='open')next.door=true;else if(a==='pass')next.location='庭';else{next.parcel=false;next.delivered=true;}
 return next;
}
export function replayPlanning(kind,history){
 const cases=planningCases[kind];if(!cases||!Array.isArray(history))return null;let scene=0,state=null,answer=null,steps=[],results=[];
 const reset=()=>{state={...(kind==='rules'?cases[scene]:cases[scene].start)};answer=null;steps=[];};reset();
 for(const action of history){const c=cases[scene];if(!c||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  if(kind==='rules'&&action.startsWith('choose:')){const choice=action.slice(7);if(![...planningActions,'none'].includes(choice))return null;answer=choice;continue;}
  if(kind!=='rules'&&action.startsWith('do:')){const name=action.slice(3),next=planningApply(state,name);if(!next)return null;state=next;steps.push(name);continue;}
  if(action==='check'){
   const possible=planningActions.filter(a=>planningApplicable(state,a));const correct=kind==='rules'?(possible.length?possible.includes(answer):answer==='none'):c.goal==='door'?state.door:c.goal==='arrived'?state.location==='庭':state.delivered;
   if(!correct)return null;results.push({state:{...state},steps:[...steps],answer});scene++;if(cases[scene])reset();continue;
  }
  return null;
 }
 return {scene,state,answer,steps,results,done:scene===cases.length};
}
