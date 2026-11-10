export const sqlNullRows=[{id:'A',quantity:5},{id:'B',quantity:7},{id:'C',quantity:null}];
export const sqlNullCases={equal:['equal'],missing:['missing'],compound:['not','or']};
export function sqlNullResult(condition,value){
 if(!['equal','missing','not','or'].includes(condition)||![5,7,null].includes(value))throw Error('invalid');
 if(condition==='missing')return value===null?'true':'false';
 const eq=value===null?'unknown':value===5?'true':'false';
 if(condition==='equal')return eq;
 if(condition==='not')return eq==='unknown'?'unknown':eq==='true'?'false':'true';
 return value===null?'true':eq;
}
export function replaySqlNull(kind,history){
 if(!Object.hasOwn(sqlNullCases,kind)||!Array.isArray(history))return null;
 const cases=sqlNullCases[kind];let scene=0,index=0,answers=[],selected=[],results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){index=0;answers=[];selected=[];continue;}
  const condition=cases[scene];
  if(index<sqlNullRows.length){const expected=sqlNullResult(condition,sqlNullRows[index].quantity);if(action!==`truth:${expected}`)return null;answers.push(expected);index++;continue;}
  const m=/^toggle:([ABC])$/.exec(action);
  if(m){selected=selected.includes(m[1])?selected.filter(id=>id!==m[1]):[...selected,m[1]];continue;}
  if(action==='check'){
   const expected=sqlNullRows.filter((r,i)=>answers[i]==='true').map(r=>r.id);
   if(expected.length!==selected.length||expected.some(id=>!selected.includes(id)))return null;
   results.push({condition,answers:[...answers],selected:[...selected].sort()});scene++;index=0;answers=[];selected=[];done=scene===cases.length;continue;
  }
  return null;
 }
 return {scene,index,answers,selected,results,done};
}
