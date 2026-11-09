export const layerCases=[
 {operation:'save',initial:2,value:3,available:true},
 {operation:'read',initial:5,value:null,available:true},
 {operation:'save',initial:2,value:3,available:false}
];
export function replayLayers(history){
 if(!Array.isArray(history))return null;let scene=0,step=0,stored=layerCases[0].initial,results=[];
 for(const action of history){
  const task=layerCases[scene];if(!task||typeof action!=='string')return null;
  const expected=[`choose:${task.operation}`,'go:service','go:storage','go:service','go:screen'][step];
  if(action!==expected)return null;
  if(step===2&&task.available&&task.operation==='save')stored=task.value;
  step++;
  if(step===5){results.push({operation:task.operation,available:task.available,stored,response:task.available?(task.operation==='save'?'saved':`value:${stored}`):'failed'});scene++;step=0;if(layerCases[scene])stored=layerCases[scene].initial;}
 }
 return {scene,step,stored,results,done:scene===layerCases.length};
}
// A and B are distinct observations even when both carry the same value.
export function replayOffline(history){
 if(!Array.isArray(history))return null;let stage=0,pending=[],recorded=[],sent=[],online=false,last='';
 for(const action of history){
  if(stage===0&&action==='observe:A'){pending=['A'];stage=1;last='端末に保存';}
  else if(stage===1&&action==='connect'){online=true;stage=2;last='通信が回復';}
  else if(stage===2&&action==='send:A'){recorded=['A'];stage=3;last='受付は記録、返事は届かない';}
  else if(stage===3&&action==='send:A'){pending=[];sent=['A'];stage=4;last='同じ番号の再送、受領を確認';}
  else if(stage===4&&action==='observe:B'){pending=['B'];stage=5;last='別の観測を保存';}
  else if(stage===5&&action==='send:B'){pending=[];recorded=['A','B'];sent=['A','B'];stage=6;last='Ｂの受領を確認';}
  else return null;
 }
 return {stage,pending,recorded,sent,online,last,done:stage===6};
}
export const conflictCases=[{first:'A'},{first:'B'}];
const conflictFresh=()=>({server:{version:1,wind:'東',sky:'晴れ'},drafts:{A:{base:1,wind:'西',sky:'晴れ'},B:{base:1,wind:'東',sky:'曇り'}},fresh:null,step:0,last:''});
// Compare and write are one indivisible operation in this fixed model.
export function conditionalSave(server,draft){
 if(!server||!draft||!Number.isInteger(server.version)||!Number.isInteger(draft.base))return null;
 if(server.version!==draft.base)return {ok:false,server:{...server},draft:{...draft}};
 return {ok:true,server:{version:server.version+1,wind:draft.wind,sky:draft.sky},draft:{...draft}};
}
export function replayConflict(history){
 if(!Array.isArray(history))return null;let scene=0,state=conflictFresh(),results=[];
 for(const action of history){
  const task=conflictCases[scene];if(!task||typeof action!=='string')return null;
  const first=task.first,other=first==='A'?'B':'A';
  if(state.step===0&&action===`send:${first}`){
   const saved=conditionalSave(state.server,state.drafts[first]);if(!saved?.ok)return null;state={...state,server:saved.server,step:1,last:`${first}の保存に成功`};
  }else if(state.step===1&&action===`send:${other}`){
   const saved=conditionalSave(state.server,state.drafts[other]);if(!saved||saved.ok)return null;state={...state,server:saved.server,step:2,last:`${other}は古い版のため拒否。下書きは残る`};
  }else if(state.step===2&&action===`refresh:${other}`){
   state={...state,fresh:{...state.server},step:3,last:`${other}が現在の版を確認`};
  }else if(state.step===3&&action===`merge:${other}`){
   const d=other==='A'?{base:state.fresh.version,wind:'西',sky:state.fresh.sky}:{base:state.fresh.version,wind:state.fresh.wind,sky:'曇り'};
   state={...state,drafts:{...state.drafts,[other]:d},step:4,last:`${other}が自分の変更を加え直した`};
  }else if(state.step===4&&action===`send:${other}`){
   const saved=conditionalSave(state.server,state.drafts[other]);if(!saved?.ok)return null;
   state={...state,server:saved.server,step:5,last:`${other}の保存に成功`};
  }else if(state.step===5&&action==='check'){
   if(state.server.wind!=='西'||state.server.sky!=='曇り')return null;
   results.push({first,server:{...state.server}});scene++;state=conflictFresh();
  }else return null;
 }
 return {scene,state,results,done:scene===conflictCases.length};
}
