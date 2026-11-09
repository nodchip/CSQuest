// A small record-room model. IDs are unique within each table and the
// destination number, not the displayed place name, connects the tables.
export const recordCases=[
 {target:'山',packages:[['A',10,true],['B',20,true],['C',10,false]],places:[[10,'山'],[20,'村']]},
 {target:'山',packages:[['D',30,true],['E',40,true],['F',30,false]],places:[[30,'村'],[40,'山']]},
 {target:'港',packages:[['G',50,true],['H',60,false],['I',60,true]],places:[[50,'森'],[60,'村']]}
];

const equal=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
// Rebuild each intermediate table from saved operations; never trust saved rows.
export function replayRecords(actions){
 if(!Array.isArray(actions))return null;
 let scene=0,phase=0,selected=[],pairs=[],chosen=[],results=[];
 for(const action of actions){
  const task=recordCases[scene];if(!task||typeof action!=='string')return null;
  const ready=task.packages.filter(row=>row[2]).map(row=>row[0]);
  const matching=task.packages.filter(row=>row[2]&&task.places.find(p=>p[0]===row[1])?.[1]===task.target).map(row=>row[0]);
  if(phase===0){
   if(action==='check'){
    if(!equal(selected,ready))return null;phase=1;
   }else if(action.startsWith('select:')){
    const id=action.slice(7);if(!task.packages.some(row=>row[0]===id))return null;
    selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];
   }else return null;
  }else if(phase===1){
   if(action==='check'){
    if(!equal(pairs,ready))return null;phase=2;
   }else if(action.startsWith('join:')){
    const parts=action.split(':'),row=task.packages.find(x=>x[0]===parts[1]);
    if(parts.length!==3||!row||!selected.includes(row[0])||String(row[1])!==parts[2]||pairs.includes(row[0])||!task.places.some(x=>x[0]===row[1]))return null;
    pairs=[...pairs,row[0]];
   }else return null;
  }else if(phase===2){
   if(action==='check'){
    if(!equal(chosen,matching))return null;phase=3;
   }else if(action.startsWith('choose:')){
    const id=action.slice(7);if(!pairs.includes(id))return null;
    chosen=chosen.includes(id)?chosen.filter(x=>x!==id):[...chosen,id];
   }else return null;
  }else{
   if(action!=='column:id')return null;
   results.push([...chosen]);scene++;phase=0;selected=[];pairs=[];chosen=[];
  }
 }
 return {scene,phase,selected,pairs,chosen,results,done:scene===recordCases.length};
}
