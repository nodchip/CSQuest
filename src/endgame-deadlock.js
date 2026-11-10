export const toolNames={X:'灯り',Y:'台車',Z:'鍵'};
export const lockCases={
 cycle:[{A:['X','Y'],B:['Y','X'],goal:'cycle'},{A:['Y','X'],B:['Y','X'],goal:'finish'}],
 order:[{A:['X','Y'],B:['X','Y'],goal:'finish'},{A:['X','Y','Z'],B:['X','Y','Z'],goal:'finish'}]
};
export function replayDeadlock(kind,history){
 if(!['cycle','order','fairness'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,held={A:[],B:[]},waiting={A:null,B:null},finished={A:false,B:false},contended=false,phase='bias',streak=0,queue=[],served=[],done=false;
 const reset=()=>{held={A:[],B:[]};waiting={A:null,B:null};finished={A:false,B:false};contended=false;phase='bias';streak=0;queue=[];served=[];};
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){reset();continue;}
  if(kind==='fairness'){
   const favorite=scene===0?'A':'B',other=favorite==='A'?'B':'A';
   const m=/^serve:([AB])$/.exec(action);
   if(m&&phase==='bias'){streak=m[1]===favorite?streak+1:0;continue;}
   if(action==='switch'&&phase==='bias'&&streak>=3){phase='queue';queue=[other,favorite];served=[];continue;}
   if(m&&phase==='queue'&&queue[0]===m[1]){queue=[queue[1],queue[0]];if(!served.includes(m[1]))served.push(m[1]);continue;}
   if(action==='check'&&phase==='queue'&&served.length===2){scene++;done=scene===2;if(!done)reset();continue;}
   return null;
  }
  const c=lockCases[kind][scene],m=/^take:([AB]):([XYZ])$/.exec(action);
  if(m){
   const person=m[1],tool=m[2],other=person==='A'?'B':'A';
   if(finished[person]||c[person][held[person].length]!==tool||(waiting[person]&&waiting[person]!==tool))return null;
   if(held[other].includes(tool)){waiting[person]=tool;contended=true;}else{held[person].push(tool);waiting[person]=null;}
   continue;
  }
  const f=/^finish:([AB])$/.exec(action);
  if(f&&!finished[f[1]]&&!waiting[f[1]]&&held[f[1]].length===c[f[1]].length){held[f[1]]=[];finished[f[1]]=true;continue;}
  const isCycle=waiting.A&&waiting.B&&held.B.includes(waiting.A)&&held.A.includes(waiting.B);
  if(action==='check'&&(c.goal==='cycle'?isCycle:finished.A&&finished.B&&contended)){scene++;done=scene===lockCases[kind].length;if(!done)reset();continue;}
  return null;
 }
 return {scene,held,waiting,finished,contended,phase,streak,queue,served,done};
}
