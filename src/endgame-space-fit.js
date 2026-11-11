import {createFreeTrial,freeSpaceStep,chooseFreeRun} from './free-space.js';
export function replaySpaceFit(kind,history){
 if(!['first','best','compare'].includes(kind)||!Array.isArray(history)||history.length>40)return null;
 let trials={first:createFreeTrial('first'),best:createFreeTrial('best')},done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){trials={first:createFreeTrial('first'),best:createFreeTrial('best')};continue;}
  if(action==='check'){if(kind==='compare'||trials[kind].stage!=='done')return null;done=true;continue;}
  if(action==='answer:fragment'){if(kind!=='compare'||trials.first.stage!=='done'||trials.best.stage!=='done')return null;done=true;continue;}
  const m=/^(first|best):(allocate4|allocate6|free4)(?::(4|11|none))?$/.exec(action);if(!m||kind!=='compare'&&kind!==m[1])return null;
  if((m[2]==='free4')!==(!m[3]))return null;
  if(m[2]==='allocate6'&&((chooseFreeRun(trials[m[1]].cells,6,m[1])===null)!==(m[3]==='none')))return null;
  let next;try{next=freeSpaceStep(trials[m[1]],m[2],m[3]==='none'||!m[3]?null:Number(m[3]));}catch{return null;}if(!next)return null;trials[m[1]]=next;
 }
 return {trials,done};
}
