// Fixed, non-null keys; results preserve one row for each matching pair.
export const queryJoinCases={
 join:[{left:[['A',1],['B',2]],right:[['薬草',1],['布',1],['道具',3]]},{left:[['C',2],['D',3]],right:[['水',2],['紙',2],['種',3]]}],
 select:[{left:[['A',1],['B',2],['C',1]],wanted:1},{left:[['D',2],['E',3],['F',2]],wanted:3}],
 compose:[{left:[['A',1],['B',2]],right:[['薬草',1],['薬草',1],['道具',3]],wanted:1},{left:[['C',2],['D',3]],right:[['水',2],['紙',2],['種',3]],wanted:3},{left:[['E',1]],right:[['木',2]],wanted:1}]
};
export function expectedRows(kind,c){
 if(kind==='select')return c.left.flatMap(([name,key],i)=>key===c.wanted?[String(i)]:[]);
 return c.left.flatMap(([,key],i)=>c.right.flatMap(([,other],j)=>key===other&&(kind!=='compose'||key===c.wanted)?[`${i}-${j}`]:[]));
}
export function replayQueryJoin(kind,history){
 const cases=queryJoinCases[kind];if(!cases||!Array.isArray(history))return null;let scene=0,selected=[],phase='rows',columns=[],results=[];
 for(const action of history){
  const c=cases[scene];if(!c||typeof action!=='string')return null;
  if(action==='reset'){selected=[];columns=[];phase='rows';continue;}
  if(phase==='rows'&&action.startsWith('row:')){const id=action.slice(4),valid=kind==='select'?c.left.map((_,i)=>String(i)):c.left.flatMap((_,i)=>c.right.map((_,j)=>`${i}-${j}`));if(!valid.includes(id))return null;selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];continue;}
  if(phase==='columns'&&action.startsWith('column:')){const name=action.slice(7);if(!['name','key','item'].includes(name))return null;columns=columns.includes(name)?columns.filter(x=>x!==name):[...columns,name];continue;}
  if(action==='check'&&phase==='rows'){const expected=expectedRows(kind,c);if(selected.length!==expected.length||expected.some(x=>!selected.includes(x)))return null;if(kind==='compose'){phase='columns';continue;}results.push([...expected]);scene++;selected=[];continue;}
  if(action==='check'&&phase==='columns'&&columns.length===2&&columns.includes('name')&&columns.includes('item')){results.push([...selected]);scene++;selected=[];columns=[];phase='rows';continue;}
  return null;
 }
 return {scene,selected,phase,columns,results,done:scene===cases.length};
}
