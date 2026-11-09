// Fixed observations; each position is a distinct day's record.
export const statisticsCases={
 frequency:[[3,1,3,2,1,3],[2,3,2,1,3,2]],
 center:[[4,1,10,3,2],[4,1,5,3,2]],
 spread:[[3,1,5,2,4,3],[4,2,3,2,4,3]]
};
export function summarize(records){
 if(!Array.isArray(records)||!records.length||records.some(n=>!Number.isFinite(n)))return null;
 const ordered=[...records].sort((a,b)=>a-b),n=ordered.length;
 return {mean:ordered.reduce((a,b)=>a+b,0)/n,median:n%2?ordered[(n-1)/2]:(ordered[n/2-1]+ordered[n/2])/2,range:ordered[n-1]-ordered[0]};
}
export function replayStatistics(kind,history){
 const cases=statisticsCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,placed={},ordered=[],phase='arrange',mean=null,median=null,range=null;const results=[];
 for(const action of history){
  const records=cases[scene];if(!records||typeof action!=='string')return null;
  if(action==='check'){
   if(phase==='arrange'&&kind==='center'){
    if(ordered.length!==records.length||ordered.some((id,i)=>i&&records[ordered[i-1]]>records[id]))return null;
   }else if(phase==='arrange'&&records.some((value,id)=>placed[id]!==value))return null;
   if(phase==='arrange'&&kind!=='frequency'){phase='answer';continue;}
   const summary=summarize(records);
   if(kind==='center'&&(mean!==summary.mean||median!==summary.median)||kind==='spread'&&range!==summary.range)return null;
   const counts=Object.fromEntries([...new Set(records)].sort((a,b)=>a-b).map(value=>[value,records.filter(n=>n===value).length]));
   results.push({...summary,counts});scene++;placed={};ordered=[];phase='arrange';mean=null;median=null;range=null;
  }else if(phase==='answer'){
   const m=/^(mean|median|range):(\d+)$/.exec(action);if(!m)return null;
   const n=Number(m[2]);if(n>10)return null;
   if(kind==='center'&&m[1]==='mean')mean=n;
   else if(kind==='center'&&m[1]==='median')median=n;
   else if(kind==='spread'&&m[1]==='range')range=n;
   else return null;
  }else if(kind==='center'){
   if(action==='undo'){if(!ordered.length)return null;ordered.pop();}
   else{const m=/^pick:(\d+)$/.exec(action),id=m?Number(m[1]):-1;if(id<0||id>=records.length||ordered.includes(id))return null;ordered.push(id);}
  }else{
   const m=/^place:(\d+):([1-5])$/.exec(action),id=m?Number(m[1]):-1,value=m?Number(m[2]):-1;
   if(id<0||id>=records.length||!cases.some(items=>items.includes(value)))return null;placed[id]=value;
  }
 }
 return {scene,placed,ordered,phase,mean,median,range,results,done:scene===cases.length};
}
