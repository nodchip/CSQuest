export const trusted=[true,false,true,false];
export const oneError=[false,false,true,false];
export const twoErrors=[false,true,true,false];
export function evenParity(lamps){return Array.isArray(lamps)&&lamps.length===4&&lamps.every(x=>typeof x==='boolean')&&lamps.filter(Boolean).length%2===0;}
export function replayRecovery(history){
 if(!Array.isArray(history))return null;let stage=0,lamps=[...oneError];
 for(const action of history){
  if(typeof action!=='string'||stage>=6)return null;
  if(stage===0&&action==='inspect')stage=1;
  else if(stage===1&&action==='hold')stage=2;
  else if(stage===2){
   const match=/^flip:([0-3])$/.exec(action);
   if(match){const i=Number(match[1]);lamps[i]=!lamps[i];}
   else if(action==='verify'&&lamps.every((x,i)=>x===trusted[i])&&evenParity(lamps))stage=3;
   else return null;
  }else if(stage===3&&action==='release')stage=4;
  else if(stage===4&&action==='inspect')stage=5;
  else if(stage===5&&action==='uncertain')stage=6;
  else return null;
 }
 return {stage,lamps,done:stage===6};
}
