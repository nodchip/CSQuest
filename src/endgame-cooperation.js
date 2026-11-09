export const countCases=[{start:0,target:1},{start:0,target:2},{start:5,target:7}];
export const lockCases=[{start:0,target:2},{start:5,target:7}];
const fresh=task=>({shared:task.start,people:{A:{step:0,local:null},B:{step:0,local:null}},owner:null,events:[]});
export function advanceCount(state,person,locked){
 if(!['A','B'].includes(person))return null;
 const people={A:{...state.people.A},B:{...state.people.B}},worker=people[person];let owner=state.owner,shared=state.shared,description;
 if(locked){
  if(worker.step===0){if(owner!==null)return null;owner=person;description='鍵を取る';}
  else if(worker.step===1){if(owner!==person)return null;worker.local=shared;description='数を読む';}
  else if(worker.step===2){if(owner!==person)return null;worker.local++;description='手元の数に１を足す';}
  else if(worker.step===3){if(owner!==person)return null;shared=worker.local;description='共有札に書く';}
  else if(worker.step===4){if(owner!==person)return null;owner=null;description='鍵を返す';}
  else return null;
 }else{
  if(worker.step===0){worker.local=shared;description='数を読む';}
  else if(worker.step===1){worker.local++;description='手元の数に１を足す';}
  else if(worker.step===2){shared=worker.local;description='共有札に書く';}
  else return null;
 }
 worker.step++;return {shared,people,owner,events:[...state.events,{person,description,shared,local:worker.local}]};
}
export function replayCount(history,locked=false){
 const cases=locked?lockCases:countCases;if(!Array.isArray(history))return null;
 let scene=0,state=fresh(cases[0]);const results=[];
 for(const action of history){
  const task=cases[scene];if(!task||typeof action!=='string')return null;
  if(action==='reset')state=fresh(task);
  else if(action==='check'){
   const end=locked?5:3;
   if(state.people.A.step!==end||state.people.B.step!==end||state.owner!==null||state.shared!==task.target)return null;
   results.push({shared:state.shared,events:state.events});scene++;if(cases[scene])state=fresh(cases[scene]);
  }else {state=advanceCount(state,action,locked);if(!state)return null;}
 }
 return {scene,state,results,done:scene===cases.length};
}
export const joinCases=[{initial:[]},{initial:['B']}];
export function replayJoin(history){
 if(!Array.isArray(history))return null;let scene=0,finished=[];const results=[];
 for(const action of history){
  const task=joinCases[scene];if(!task||typeof action!=='string')return null;
  const ready=[...new Set([...task.initial,...finished])];
  if(action==='send'){
   if(!ready.includes('A')||!ready.includes('B'))return null;
   results.push(ready);scene++;finished=[];
  }else if(['A','B'].includes(action)&&!ready.includes(action))finished.push(action);else return null;
 }
 return {scene,ready:scene<joinCases.length?[...new Set([...joinCases[scene].initial,...finished])]:[],results,done:scene===joinCases.length};
}
