export const usabilityCases=[
 {id:'labels',options:['vague','specific'],answer:'specific'},
 {id:'formative',options:['judge','improve'],answer:'improve'},
 {id:'summative',options:['judge','improve'],answer:'judge'}
];
export function replayUsability(history){
 if(!Array.isArray(history))return null;
 let scene=0,choice=null;const results=[];
 for(const action of history){
  const task=usabilityCases[scene];if(!task||typeof action!=='string')return null;
  if(action==='test'){
   if(choice!==task.answer)return null;results.push(choice);scene++;choice=null;
  }else if(action.startsWith('choose:')&&task.options.includes(action.slice(7)))choice=action.slice(7);
  else return null;
 }
 return {scene,choice,results,done:scene===usabilityCases.length};
}
