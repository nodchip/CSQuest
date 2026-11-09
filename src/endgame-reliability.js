export const copyScenes=[['red','red','blue'],['blue','red','blue'],['blue','blue','blue']];
export function replayCopies(history){
 if(!Array.isArray(history))return null;let scene=0,copies=[...copyScenes[0]],results=[];
 for(const action of history){
  if(scene===3){if(action!=='uncertain')return null;scene++;continue;}
  const initial=copyScenes[scene];if(!initial||typeof action!=='string')return null;
  const match=/^flip:([0-2])$/.exec(action);
  if(match){const i=Number(match[1]);copies[i]=copies[i]==='red'?'blue':'red';}
  else if(action==='check'){
   const red=initial.filter(x=>x==='red').length,majority=red>=2?'red':'blue';
   if(!copies.every(x=>x===majority))return null;
   results.push({initial:[...initial],copies:[...copies]});scene++;if(copyScenes[scene])copies=[...copyScenes[scene]];
  }else return null;
 }
 return {scene,copies,results,done:scene===4};
}
export const pipelineCases=[{count:3,target:6},{count:3,target:4},{count:1,target:2}];
const fresh=()=>({prepared:[],finished:[],ticks:[],choice:{A:0,B:0}});
export function replayPipeline(history){
 if(!Array.isArray(history))return null;let scene=0,state=fresh(),results=[];
 for(const action of history){
  const task=pipelineCases[scene];if(!task||typeof action!=='string')return null;
  if(action==='reset'){state=fresh();continue;}
  if(action==='check'){
   if(state.finished.length!==task.count||state.ticks.length!==task.target)return null;
   results.push({ticks:state.ticks,first:state.ticks.findIndex(t=>t.B!==0)+1});scene++;state=fresh();continue;
  }
  if(action==='tick'){
   const {A,B}=state.choice;
   if((!A&&!B)||(A&&(state.prepared.includes(A)||A>task.count))||(B&&(!state.prepared.includes(B)||state.finished.includes(B)||B>task.count)))return null;
   state={prepared:A?[...state.prepared,A]:state.prepared,finished:B?[...state.finished,B]:state.finished,ticks:[...state.ticks,{A,B}],choice:{A:0,B:0}};
  }else{
   const match=/^([AB]):([0-3])$/.exec(action);if(!match||Number(match[2])>task.count)return null;
   state.choice={...state.choice,[match[1]]:Number(match[2])};
  }
 }
 return {scene,state,results,done:scene===pipelineCases.length};
}
