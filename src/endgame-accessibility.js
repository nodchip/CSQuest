// A deliberately limited prototype: each scene changes one property at a time.
export const accessibilityCases=[
 {id:'keyboard',options:['decoration','button'],answer:'button'},
 {id:'focus',options:['hidden','visible'],answer:'visible'},
 {id:'name',options:['generic','destination'],answer:'destination'}
];
export function replayAccessibility(history){
 if(!Array.isArray(history))return null;
 let scene=0,choice=null;const results=[];
 for(const action of history){
  const task=accessibilityCases[scene];if(!task||typeof action!=='string')return null;
  if(action==='test'){
   if(choice!==task.answer)return null;results.push(choice);scene++;choice=null;
  }else if(action.startsWith('choose:')&&task.options.includes(action.slice(7)))choice=action.slice(7);
  else return null;
 }
 return {scene,choice,results,done:scene===accessibilityCases.length};
}
