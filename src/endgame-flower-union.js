export const flowerSets={A:[1,4,5,7],B:[2,4,6,7],C:[3,5,6,7]};
export function replayFlowerUnion(kind,history){
 if(!['two','overlap','three'].includes(kind)||!Array.isArray(history)||history.length>50)return null;
 let selected=[],checked=false,done=false;
 const target={two:[1,2,4,5,6,7],overlap:[4,5,6,7],three:[1,2,3,4,5,6,7]}[kind];
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){selected=[];checked=false;continue;}
  const m=/^pick:([1-7])$/.exec(action);
  if(m&&!checked){const n=Number(m[1]);selected=selected.includes(n)?selected.filter(x=>x!==n):[...selected,n].sort((a,b)=>a-b);continue;}
  if(action==='check'&&!checked){if(selected.length!==target.length||!target.every(n=>selected.includes(n)))return null;checked=true;if(kind==='two')done=true;continue;}
  if(checked&&action===(kind==='overlap'?'answer:6':'answer:7')){done=true;continue;}
  return null;
 }
 return {selected,checked,done};
}
