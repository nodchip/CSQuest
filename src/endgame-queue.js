// One output channel; each send occupies exactly one minute in this model.
export const queueScenes=[
 [['A',0],['B',0]],
 [['A',0],['B',1]],
 [['A',0],['B',0],['C',0]],
 [['A',0],['B',3]]
];
export function replayQueue(history){
 if(!Array.isArray(history))return null;
 let scene=0,time=0,sent=[],waits=[],results=[];
 for(const action of history){
  const tasks=queueScenes[scene];if(!tasks||typeof action!=='string')return null;
  const pending=tasks.filter(([id,arrival])=>!sent.includes(id)&&arrival<=time);
  if(action==='wait'){
   if(pending.length)return null;
   time++;continue;
  }
  const first=pending[0];if(!first||action!==`send:${first[0]}`)return null;
  waits.push([first[0],time-first[1]]);sent.push(first[0]);time++;
  if(sent.length===tasks.length){results.push(waits);scene++;time=0;sent=[];waits=[];}
 }
 const tasks=queueScenes[scene]??[],pending=tasks.filter(([id,arrival])=>!sent.includes(id)&&arrival<=time);
 return {scene,time,sent,waits,results,pending:pending.map(([id])=>id),done:scene===queueScenes.length};
}
