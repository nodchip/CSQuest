// One isolated transaction per case; the complete journal is assumed durable and correct.
export const journalCases={
 undo:[{before:[5,2],after:[3,4],disk:[3,2],committed:false},{before:[4,1],after:[3,2],disk:[4,2],committed:false}],
 redo:[{before:[5,2],after:[3,4],disk:[5,2],committed:true},{before:[4,1],after:[3,2],disk:[3,1],committed:true}],
 decide:[{before:[6,1],after:[4,3],disk:[4,1],committed:false},{before:[6,1],after:[4,3],disk:[4,1],committed:true},{before:[3,3],after:[2,4],disk:[3,4],committed:false}]
};
export function replayJournal(kind,history){
 const cases=journalCases[kind];if(!cases||!Array.isArray(history))return null;let scene=0,chosen=[null,null],results=[];
 for(const action of history){const c=cases[scene];if(!c||typeof action!=='string')return null;
  if(action==='reset'){chosen=[null,null];continue;}
  const m=/^set:([01]):(before|after)$/.exec(action);if(m){chosen[Number(m[1])]=m[2];continue;}
  if(action==='check'){const expected=c.committed?'after':'before';if(chosen.some(x=>x!==expected))return null;results.push([...c[expected]]);scene++;chosen=[null,null];continue;}
  return null;
 }
 const c=cases[scene],disk=c?c.disk.map((v,i)=>chosen[i]===null?v:c[chosen[i]][i]):null;
 return {scene,chosen,disk,results,done:scene===cases.length};
}
