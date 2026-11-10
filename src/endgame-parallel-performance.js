export const loads=[6,12];
export function elapsed(load,workers,overhead=false){
 if(!loads.includes(load)||![1,2,3,6].includes(workers)||load%workers!==0)return null;
 return 2+load/workers+(overhead?workers-1:0);
}
export function replayPerformance(kind,history){
 if(!['serial','parallel','overhead'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,prepared=false,packed=0,trials=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  const load=loads[scene];
  if(action==='reset'){prepared=false;packed=0;trials=[];continue;}
  if(kind==='serial'){
   if(action==='prepare'&&!prepared){prepared=true;continue;}
   const m=/^pack:([13])$/.exec(action);
   if(m&&prepared&&packed+Number(m[1])<=load){packed+=Number(m[1]);continue;}
   if(action==='check'&&prepared&&packed===load){scene++;done=scene===loads.length;prepared=false;packed=0;continue;}
   return null;
  }
  const allowed=kind==='parallel'?[2,3]:[2,3,6];
  const m=/^try:([236])$/.exec(action);
  if(m&&allowed.includes(Number(m[1]))){const n=Number(m[1]);if(!trials.includes(n))trials.push(n);continue;}
  const answer=/^choose:([236])$/.exec(action);
  if(answer&&allowed.every(x=>trials.includes(x))){const n=Number(answer[1]),best=Math.min(...allowed.map(x=>elapsed(load,x,kind==='overhead')));if(allowed.includes(n)&&elapsed(load,n,kind==='overhead')===best){scene++;done=scene===loads.length;trials=[];continue;}}
  return null;
 }
 return {scene,prepared,packed,trials,done};
}
