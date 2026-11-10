const even=[5,1,8,3,6,2,7,4],odd=[5,1,7,3,6,2,4],extreme=[5,1,20,3,6,2,7,4];
export const interquartileCases={even:[even],odd:[odd],compare:[even,extreme]};
const median=sorted=>{const m=Math.floor(sorted.length/2);return sorted.length%2?sorted[m]:(sorted[m-1]+sorted[m])/2;};
export function interquartileStats(values){const sorted=[...values].sort((a,b)=>a-b),m=Math.floor(sorted.length/2),q1=median(sorted.slice(0,m)),q3=median(sorted.slice(Math.ceil(sorted.length/2)));return {q1,q3,iqr:q3-q1,range:sorted.at(-1)-sorted[0]};}
export function replayInterquartile(kind,history){
 if(!Object.hasOwn(interquartileCases,kind)||!Array.isArray(history))return null;
 const cases=interquartileCases[kind];let scene=0,sorted=[],phase='sort',results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===cases.length){if(kind==='compare'&&action==='answer:same'){done=true;continue;}return null;}
  if(action==='reset'){sorted=[];phase='sort';continue;}
  const values=cases[scene],stats=interquartileStats(values),ordered=[...values].sort((a,b)=>a-b);
  if(phase==='sort'){if(action!==`pick:${ordered[sorted.length]}`)return null;sorted.push(ordered[sorted.length]);if(sorted.length===ordered.length)phase='q1';continue;}
  if(['q1','q3','iqr','range'].includes(phase)){
   if(action!==`answer:${stats[phase]}`)return null;
   phase=phase==='q1'?'q3':phase==='q3'?'iqr':phase==='iqr'&&kind==='compare'?'range':'check';continue;
  }
  if(phase==='check'&&action==='check'){results.push(stats);scene++;sorted=[];phase='sort';if(scene===cases.length&&kind!=='compare')done=true;continue;}
  return null;
 }
 return {scene,sorted,phase,results,done};
}
