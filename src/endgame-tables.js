// Sets of unique recipient numbers; duplicates are intentionally removed.
export const tableCases=[
 {left:[10,20,30],right:[20,40],operation:'union'},
 {left:[10,20,30],right:[20,40],operation:'intersection'},
 {left:[10,20,30],right:[20,40],operation:'difference'},
 {left:[10,20],right:[10,20,30],operation:'difference'},
 {left:[10,20,30],right:[10,20],operation:'difference'},
 {left:[10,30],right:[20,40],operation:'intersection'}
];
export function tableExpected(task){
 if(task.operation==='union')return [...new Set([...task.left,...task.right])];
 if(task.operation==='intersection')return task.left.filter(id=>task.right.includes(id));
 if(task.operation==='difference')return task.left.filter(id=>!task.right.includes(id));
 return [];
}
export function replayTables(history){
 if(!Array.isArray(history))return null;
 let scene=0,selected=[];const results=[];
 for(const action of history){
  const task=tableCases[scene];if(!task||typeof action!=='string')return null;
  if(action==='check'){
   const expected=tableExpected(task);
   if(selected.length!==expected.length||expected.some(id=>!selected.includes(id)))return null;
   results.push([...selected]);selected=[];scene++;continue;
  }
  const match=/^choose:(\d+)$/.exec(action);if(!match)return null;
  const id=Number(match[1]);if(![...task.left,...task.right].includes(id))return null;
  selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];
 }
 return {scene,selected,results,done:scene===tableCases.length};
}
